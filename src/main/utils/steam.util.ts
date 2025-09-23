import { AccountOptionRecords, IAccountOptions, IGuardCode, UserRecords } from '@main/models/api'
import SteamTotp from 'steam-totp'
import SteamUser from 'steam-user'
import {
  ensureFileExists,
  readFileListInDir,
  readJsonFile,
  saveFileAsJson
} from '@main/utils/file.util'
import { IMaFile, IMaFileRecord, ISteamAuthData } from '@main/models/server'
import { ACCOUNT_OPTIONS_FILENAME } from '@main/constants/constants'
import SteamCommunity from 'steamcommunity'
import TradeOfferManager from 'steam-tradeoffer-manager'

/// SDA Account options
//Сделать папку наблюдаемой, вместо этой порнухи
const maFiles: IMaFileRecord = {}
const accountsOptions: AccountOptionRecords = {}
const users: UserRecords = {}
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

export const createClient = (login: string): void => {
  let client: any = undefined
  if (users[login].client) {
    client = users[login].client
  } else {
    client = new SteamUser()
  }

  client.logOn({
    accountName,
    password,
    twoFactorCode: SteamTotp.generateAuthCode(sharedSecret)
  })

  client.on('loggedOn', () => {
    console.log('Залогинились')
    //client.setPersona(SteamUser.EPersonaState.Online)
    //client.gamesPlayed(440)
  })

  client.on('disconnected', (eresult, msg) => {
    console.log(`Lost connection to Steam: ${msg} (${eresult})`)
    // Handle reconnection logic or error reporting
  })

  //TODO нужно ли мне это
  client.on('error', (err) => console.error('Steam error', err))

  //TODO возобновление сессии?
}

export const createCommunity = (maFile: IMaFile): void => {
  const community = new SteamCommunity()
}

export const createManager = (maFile: IMaFile): void => {
  const manager = new TradeOfferManager({
    steam: client,
    community: community,
    language: 'ru'
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
export const steamAuth = async (login: string): Promise<ISteamAuthData> => {
  const client = new SteamUser()

  const guard = await getGuardCode(maFiles[login].shared_secret)

  if (!accountsOptions[login].password) throw 'Не задан пароль аккаунта'

  await client.logOn({
    accountName: login,
    password: accountsOptions[login].password,
    twoFactorCode: guard.code
  })

  const auth = new Promise((resolve, reject) => {
    client.on('webSession', async (sessionID, cookies) => {
      try {
        resolve({ sessionID, cookies })
      } catch (e: unknown) {
        reject(e)
      }
    })
  })

  //TODO нужно ли мне это
  client.on('error', (err) => console.error('Steam error', err))

  return auth as Promise<ISteamAuthData>
}

// Trade Offers
/*
client.on('webSession', (sessionID, cookies) => {
  console.log('Получена веб-сессия Steam')
  manager.setCookies(cookies, (err) => {
    if (err) {
      console.error('Ошибка установки cookies для менеджера:', err)
      return
    }
    console.log('Менеджер готов к работе с предложениями обмена')

    // Получаем активные предложения обмена
    manager.getOffers({ get_received_offers: 1, active_only: 1 }, (err, body) => {
      if (err) {
        console.error('Ошибка получения предложений:', err)
        return
      }

      const offers = body.response.trade_offers_received
      if (!offers.length) {
        console.log('Нет активных предложений обмена')
        return
      }

      offers.forEach((offer) => {
        console.log(`Предложение от ${offer.accountid_other} с id ${offer.tradeofferid}`)
        // Здесь можно показать оффер пользователю и решить, принять ли

        // Для примера — принять все предложения
        manager.acceptOffer(offer.tradeofferid, (err, status) => {
          if (err) {
            console.error('Ошибка принятия предложения:', err)
            return
          }
          console.log(`Предложение ${offer.tradeofferid} принято, статус: ${status}`)

          // Подтверждаем через моб.аутентификатор
          community.acceptConfirmationForObject(sharedSecret, offer.tradeofferid, (err) => {
            if (err) {
              console.error('Ошибка подтверждения сделки:', err)
            } else {
              console.log('Сделка подтверждена мобильным аутентификатором!')
            }
          })
        })
      })
    })
  })
})
*/
