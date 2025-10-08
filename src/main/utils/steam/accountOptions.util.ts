import { AccountOptionRecords, IAccountOptions } from '@main/models/api'
import { ensureFileExists, readJsonFile, saveFileAsJson } from '@main/utils/file.util'
import { ACCOUNT_OPTIONS_FILENAME, ACCOUNT_OPTIONS_FOLDER } from '@main/constants/constants'
import Notification from '../notify.util'
import { _accountsOptions, accountsOptions, maFiles, store } from '@main/store/store'

export const load = async (): Promise<void> => {
  try {
    const optionsFolder = store.get('optionsFolder', ACCOUNT_OPTIONS_FOLDER) as string

    const fileExist = await ensureFileExists(ACCOUNT_OPTIONS_FILENAME, optionsFolder)
    if (!fileExist) await saveFileAsJson(ACCOUNT_OPTIONS_FILENAME, optionsFolder, {})

    const options = await readJsonFile<AccountOptionRecords>(
      ACCOUNT_OPTIONS_FILENAME,
      optionsFolder
    )

    for (const elem in maFiles) {
      const login = maFiles[elem].account_name

      accountsOptions[login] = {
        ...options[elem],
        login: login
      }
    }
  } catch (e: unknown) {
    console.error(e)
    Notification.error('loadAccountsOptions', `${e}`)
  }
}

export const get = async (): Promise<AccountOptionRecords> => {
  if (!accountsOptions) await load()
  return accountsOptions
}

export const save = (): void => {
  const optionsFolder = store.get('optionsFolder', ACCOUNT_OPTIONS_FOLDER) as string
  saveFileAsJson(ACCOUNT_OPTIONS_FILENAME, optionsFolder, _accountsOptions)
}

export const update = (data: IAccountOptions): void => {
  accountsOptions[data.login] = { ...accountsOptions[data.login], ...data }
}
