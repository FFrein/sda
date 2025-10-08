import SteamUser from 'steam-user'
import { createDirIfNotExists, readFileListInDir, readJsonFile } from '@main/utils/file.util'
import { IMaFile, IMaFileRecord } from '@main/models/server'
import { DEFAULT_MAFILE_FOLDER } from '@main/constants/constants'
import SteamCommunity from 'steamcommunity'
import { maFiles, store } from '@main/store/store'
import fs from 'fs'
import * as AccountOptions from './accountOptions.util'

export const load = async (): Promise<IMaFileRecord> => {
  const maFileFolder = store.get('maFileFolder', DEFAULT_MAFILE_FOLDER) as string

  createDirIfNotExists(maFileFolder)

  const files = readFileListInDir(maFileFolder, ['.maFile'])

  files.forEach(async (fileName) => {
    const maFile = await readJsonFile<IMaFile>(fileName, maFileFolder)
    maFiles[maFile.account_name] = maFile
  })

  AccountOptions.load()

  return maFiles
}

export const get = async (): Promise<IMaFileRecord> => {
  if (!maFiles) await load()

  return maFiles
}

export const getByLogin = async (login: string): Promise<IMaFile> => {
  if (!maFiles) await load()
  return maFiles[login]
}

export const create = async (login: string, password: string): Promise<void> => {
  const client = new SteamUser()
  const community = new SteamCommunity()

  const logOnOptions = {
    accountName: login,
    password: password
    // Можно добавить здесь shared_secret, если он у вас уже есть
  }

  client.logOn(logOnOptions)

  client.on('loggedOn', () => {
    client.setPersona(SteamUser.EPersonaState.Online)
  })

  client.on('twoFactor', (codeCallback) => {
    // Когда Steam запрашивает 2FA код
    // Выводим инструкцию, например запросить у пользователя код из мобильного приложения
    console.log('Введите код Steam Guard:')
    process.stdin.once('data', (data) => {
      const code = data.toString().trim()
      codeCallback(code)
    })
  })

  // После успешного логина получаем maFile
  client.on('machineAuth', (machAuth, callback) => {
    const sentry = machAuth.bytes
    // Сохраняем sentry файл (можно использовать как maFile)
    fs.writeFileSync('sentry.bin', sentry)
    callback({ sha_file: SteamUser.SHAFile(sentry) })
  })

  // После логина попробуем получить maFile через community
  client.on('webSession', (_, cookies) => {
    community.setCookies(cookies)

    community.enableTwoFactor((err) => {
      if (err) {
        console.log('Steam Guard уже включен или ошибка:', err)
        return
      }

      // Получаем maFile
      const maFile = community.getSharedSecret()

      if (maFile) {
        fs.writeFileSync('maFile.json', JSON.stringify(maFile, null, 2))
        console.log('maFile сохранён в maFile.json')
      }
    })
  })
}
