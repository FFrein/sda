import { IGuardCode, ITradeOffer } from '@main/models/api'
import SteamTotp from 'steam-totp'
import SteamUser from 'steam-user'
import { IUser } from '@main/models/server'
import SteamCommunity from 'steamcommunity'
import TradeOfferManager from 'steam-tradeoffer-manager'
import { sendNotify } from '../notify.util'
import { accountsOptions, maFiles, users } from '@main/store/store'

let globalOffset: number | null = null

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

    //TODO сделать фалй для хранение токенов авторизации. Живёт очень долго, около месяца или пока не сменится пароль, 2fa или не уничтожить атворизации
    if (users[login]?.refreshToken) {
      client.logOn({
        refreshToken: users[login].refreshToken
      })
    } else {
      if (!accountsOptions[login]?.password) throw 'password not set'

      client.logOn({
        accountName: login,
        password: accountsOptions[login]?.password,
        twoFactorCode: SteamTotp.generateAuthCode(maFiles[login]?.shared_secret)
      })
    }

    client.on('sessionToken', (token) => {
      sendNotify('sessionToken')
      users[login].refreshToken = token
    })

    client.on('loggedOn', () => {
      sendNotify('Залогинились')
      createCommunity(login)
      //client.setPersona(SteamUser.EPersonaState.Online)
      //client.gamesPlayed(440)
    })

    client.on('webSession', (sessionID, cookies) => {
      sendNotify('webSession')
      users[login].sessionID = sessionID
      users[login].cookies = cookies

      createManager(login)
    })

    client.on('disconnected', (eresult, msg) => {
      sendNotify(`Lost connection to Steam: ${msg} (${eresult})`)
      // Handle reconnection logic or error reporting
      users[login].client = undefined
      users[login].manager = undefined
      users[login].community = undefined

      if (eresult === SteamUser.EResult.InvalidPassword || eresult === SteamUser.EResult.Expired) {
        users[login].refreshToken = undefined
      }

      client.logOn({
        accountName: login,
        password: accountsOptions[login].password,
        twoFactorCode: SteamTotp.generateAuthCode(maFiles[login].shared_secret)
      })
    })

    //TODO нужно ли мне это
    client.on('error', (e) => {
      sendNotify(`Error | Steam error: ${e}`)
    })

    //TODO возобновление сессии?
  } catch (e) {
    sendNotify(`ERROR | createClient | ${e}`)
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
      sendNotify(`ERROR | Аккаунт ${login}: Ошибка установки cookies для менеджера: ${err}`)
      return
    }
    sendNotify(`Аккаунт ${login}: Менеджер готов к работе с предложениями обмена`)
  })

  manager.on('newOffer', function (offer) {
    sendNotify(`New incoming offer received: ${offer.id}`)
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

// Trade Offers
export const getTradeOffers = async (login: string): Promise<ITradeOffer[]> => {
  //Бля, как правильно читать поле чтобы не вылетало
  if (!users[login]?.manager) throw new Error('user dont have manager')
  const { manager } = users[login]

  console.log('getTradeOffers', login)

  return new Promise((resolve, reject) => {
    manager.getOffers(TradeOfferManager.EOfferFilter.ActiveOnly, (err, body) => {
      if (err) return reject(err)

      const offers = body?.response?.trade_offers_received ?? []
      resolve(offers)
    })
  })
}

export const acceptTradeOffer = (login: string, tradeOfferId: string): Promise<unknown> => {
  const { manager, community } = users[login]

  return new Promise((resolve, reject) => {
    manager.acceptOffer(tradeOfferId, (err, status) => {
      if (err) {
        reject({ text: 'Ошибка принятия предложения:', err })
        return
      }
      resolve(`Предложение ${tradeOfferId} принято, статус: ${status}`)

      community.acceptConfirmationForObject(maFiles[login].shared_secret, tradeOfferId, (err) => {
        if (err) {
          reject({ text: 'Ошибка подтверждения сделки:', err })
        } else {
          resolve('Сделка подтверждена мобильным аутентификатором!')
        }
      })
    })
  })
}
