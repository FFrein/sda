import { IGuard, IAccountOptions } from '../models/api'
import {
  getAccountsOptions,
  getGuardCode,
  getMaFiles,
  loadMaFiles,
  steamAuth,
  updateAccountsOptions
} from '@main/utils/steam.util'
import { BrowserWindow } from 'electron'
import { setCookiesToWindow } from '@main/utils/window.util'

export const getAccount = async (): Promise<IAccountOptions[]> => {
  const maFiles = await loadMaFiles()
  const accountsOptions = await getAccountsOptions()

  const result = [] as IAccountOptions[]

  for (const acc in maFiles) {
    result.push({
      ...accountsOptions[maFiles[acc].account_name],
      login: maFiles[acc].account_name,
      password: undefined
    })
  }

  return result
}

export const createAccount = (data: IAccountOptions): string => {
  try {
    //accounts.push(data)
    return 'ok'
  } catch (e: unknown) {
    if (e instanceof Error) {
      return e.message
    } else {
      return 'error'
    }
  }
}

export const updateAccount = (data: IAccountOptions): Promise<IAccountOptions> => {
  return updateAccountsOptions(data)
}

export const deleteAccount = (login: string): string => {
  return 'ok'
}

export const getGuard = async (login: string): Promise<string | IGuard> => {
  const maFiles = await getMaFiles()
  const elem = maFiles[login]

  if (elem) {
    return await getGuardCode(elem?.shared_secret)
  } else {
    return 'Аккаунт не найден'
  }
}

export const openInBrowser = async (login: string): Promise<string> => {
  try {
    const auth = await steamAuth(login)
    const url = 'https://steamcommunity.com/'
    const win = new BrowserWindow({
      width: 800,
      height: 600
    })

    await setCookiesToWindow(win, auth.cookies)

    win.loadURL(url)

    return 'ok'
  } catch {
    return 'no ok'
  }
}
