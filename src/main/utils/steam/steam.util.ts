import { IGuardCode } from '@main/models/api'
import SteamTotp from 'steam-totp'
import SteamUser from 'steam-user'
import { IUser } from '@main/models/server'
import SteamCommunity from 'steamcommunity'
import TradeOfferManager from 'steam-tradeoffer-manager'
import Notification from '../notify.util'
import { accountsOptions, maFiles, users } from '@main/store/store'

export let globalOffset: number | null = null

export const authQueue: string[] = []

// Accounts Authorization
// TODO придумать логику когда авторизовывать аккаунты
// 1) При запуске? Проверка есть ли токен, если есть пробовать по токену. Если токена нету или истёк по паролю. Если пароля нету, не пробовать авторизовывать.
// 2) При установке пароля аккаунту выполнять авторизацию?
// 3) На всякий случай добавить кнопку переавторизации, но тогда нужно будет придумать лоигку с тротлером(или дебаунс, не помню как правильно)
// 4) Оповещение о неправильном пароля и его последующем стерании?
//
export const createClient = async (login: string): Promise<void> => {
  try {
    users[login] ??= {} as IUser
    users[login].client ??= new SteamUser()

    const client = users[login].client

    if (accountsOptions[login]?.refreshToken) {
      client.logOn({
        refreshToken: accountsOptions[login].refreshToken
      })
    } else {
      if (!accountsOptions[login]?.password) throw 'password not set'

      client.logOn({
        accountName: login,
        password: accountsOptions[login]?.password,
        twoFactorCode: SteamTotp.generateAuthCode(maFiles[login]?.shared_secret)
      })
    }

    client.on('refreshToken', (token) => {
      accountsOptions[login] = { ...accountsOptions[login], refreshToken: token }
    })

    client.on('loggedOn', () => {
      createCommunity(login)
      Notification.accountLoggedOn(login)
      //client.setPersona(SteamUser.EPersonaState.Online)
      //client.gamesPlayed(440)
    })

    client.on('webSession', (sessionID, cookies) => {
      users[login].sessionID = sessionID
      users[login].cookies = cookies

      createManager(login)
    })

    client.on('disconnected', (eresult, msg) => {
      Notification.accountLoggedOff(login, msg)

      users[login].client = undefined
      users[login].manager = undefined
      users[login].community = undefined

      if (eresult === SteamUser.EResult.InvalidPassword || eresult === SteamUser.EResult.Expired) {
        accountsOptions[login].refreshToken = undefined
      }

      client.logOn({
        accountName: login,
        password: accountsOptions[login].password,
        twoFactorCode: SteamTotp.generateAuthCode(maFiles[login].shared_secret)
      })
    })

    //TODO нужно ли мне это
    client.on('error', (e) => {
      Notification.error(`Аккаунт ${login}`, `${e}`)
    })

    //TODO возобновление сессии?
  } catch (e) {
    Notification.error(`Аккаунт ${login}`, `${e}`)
  }
}

const createCommunity = (login: string): void => {
  users[login].community ??= new SteamCommunity()
}

const createManager = (login: string): void => {
  users[login].manager ??= new TradeOfferManager({
    steam: users[login].client,
    community: users[login].community,
    language: 'ru'
  })

  const manager = users[login].manager

  manager.setCookies(users[login].cookies, (err) => {
    if (err) {
      Notification.error(`Аккаунт ${login}`, `Ошибка установки cookies для менеджера: ${err}`)
      return
    }
  })

  manager.on('newOffer', function (offer) {
    Notification.message(`New incoming offer received: ${offer.id}`)
    // You can now process the 'offer' object
    // e.g., offer.data, offer.getTheirInventory(), offer.getMyInventory()
  })
}

// 2FA
export const initSteamOffset = (): Promise<number> => {
  return new Promise((resolve, reject) => {
    SteamTotp.getTimeOffset(async (err, offset) => {
      if (err) return reject(err)
      if (offset instanceof Promise) {
        globalOffset = await offset
        resolve(await offset)
      } else {
        globalOffset = offset
        resolve(offset)
      }
    })
  })
}

export const getGuardCode = async (secret: string): Promise<IGuardCode> => {
  if (globalOffset === null) await initSteamOffset()

  const code = SteamTotp.generateAuthCode(secret, globalOffset)
  const now = Math.floor(Date.now() / 1000)
  const ttl = 30 - ((now + globalOffset!) % 30)

  return { code, ttl }
}

export const authAccounts = async (): Promise<void> => {
  setInterval(() => {
    const login = authQueue.pop()
    login && createClient(login)
  }, 30000)
}
