import { AccountOptionRecords, IAccountOptions, IGuardCode, ITradeOffer } from '@main/models/api'
import SteamTotp from 'steam-totp'
import SteamUser from 'steam-user'
import {
  ensureFileExists,
  readFileListInDir,
  readJsonFile,
  saveFileAsJson
} from '@main/utils/file.util'
import { IMaFile, IMaFileRecord, IUser, UserRecords } from '@main/models/server'
import { ACCOUNT_OPTIONS_FILENAME } from '@main/constants/constants'
import SteamCommunity from 'steamcommunity'
import TradeOfferManager from 'steam-tradeoffer-manager'
import { sendNotify } from './notify.util'

/// SDA Account options
//Сделать папку наблюдаемой, вместо этой порнухи с loadMaFiles
const maFiles: IMaFileRecord = {}
const accountsOptions: AccountOptionRecords = {}
export const users: UserRecords = {}
let globalOffset: number | null = null

export const loadMaFiles = async (): Promise<IMaFileRecord> => {
  const files = readFileListInDir('/home/a485/Документы/sda', ['.maFile'])

  files.forEach(async (fileName) => {
    const maFile = await readJsonFile<IMaFile>(fileName, '/home/a485/Документы/sda')
    maFiles[maFile.account_name] = maFile
  })

  loadAccountsOptions()

  return maFiles
}

export const getMaFiles = async (): Promise<IMaFileRecord> => {
  if (!maFiles) await loadMaFiles()
  return maFiles
}

export const getMaFileByLogin = async (login: string): Promise<IMaFile> => {
  if (!maFiles) await loadMaFiles()
  return maFiles[login]
}

export const loadAccountsOptions = async (): Promise<void> => {
  try {
    await ensureFileExists(ACCOUNT_OPTIONS_FILENAME, __dirname)
    const options = await readJsonFile<AccountOptionRecords>(ACCOUNT_OPTIONS_FILENAME, __dirname)

    for (const elem in maFiles) {
      const login = maFiles[elem].account_name

      accountsOptions[login] = {
        ...options[elem],
        login: login
      }
    }
  } catch (e: unknown) {
    console.error(e)
  }
}

export const getAccountsOptions = async (): Promise<AccountOptionRecords> => {
  if (!accountsOptions) await loadAccountsOptions()
  return accountsOptions
}

export const saveAccountOptions = async (): Promise<void> => {
  saveFileAsJson(ACCOUNT_OPTIONS_FILENAME, __dirname, accountsOptions)
}

export const updateAccountsOptions = async (data: IAccountOptions): Promise<IAccountOptions> => {
  accountsOptions[data.login] = data
  saveAccountOptions()
  return accountsOptions[data.login]
}

// Accounts Authorization
// TODO придумать логику когда авторизовывать аккаунты
// 1) При запуске? Проверка есть ли токен, если есть пробовать по токену. Если токена нету или истёк по паролю. Если пароля нету, не пробовать авторизовывать.
// 2) При установке пароля аккаунту выполнять авторизацию?
// 3) На всякий случай добавить кнопку переавторизации, но тогда нужно будет придумать лоигку с тротлером(или дебаунс, не помню как правильно)
// 4) Оповещение о неправильном пароля и его последующем стерании?
//
export const createClient = async (login: string): Promise<string> => {
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
    console.log('sessionToken')
    users[login].refreshToken = token
    // тут можно записать его в файл для долговременного хранения
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
      //TODO уничтожать токен авторизации
      users[login].refreshToken = undefined
    }

    client.logOn({
      login,
      password: accountsOptions[login].password,
      twoFactorCode: SteamTotp.generateAuthCode(maFiles[login].shared_secret)
    })
  })

  //TODO нужно ли мне это
  client.on('error', (err) => console.error('Steam error', err))

  //TODO возобновление сессии?
  return 'ok'
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
      console.error(`Аккаунт ${login}: Ошибка установки cookies для менеджера:`, err)
      return
    }
    console.log(`Аккаунт ${login}: Менеджер готов к работе с предложениями обмена`)
  })

  manager.on('newOffer', function (offer) {
    console.log('New incoming offer received:', offer.id)
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

//В будущем можно переписать на qr, но для этого надо будет сильно постараться

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
