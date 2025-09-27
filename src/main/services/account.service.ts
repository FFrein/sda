import { IGuardCode, IAccountOptions, ITradeOffer } from '../models/api'
import * as SteamUtils from '@main/utils/steam.util'
import { BrowserWindow } from 'electron'
import { setCookiesToWindow } from '@main/utils/window.util'

export const getAccount = async (): Promise<IAccountOptions[]> => {
  const maFiles = await SteamUtils.loadMaFiles()
  const accountsOptions = await SteamUtils.getAccountsOptions()

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
    console.log(data)
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
  return SteamUtils.updateAccountsOptions(data)
}

export const deleteAccount = (login: string): string => {
  return `deleteAccount ${login}`
}

export const getGuard = async (login: string): Promise<string | IGuardCode> => {
  const maFiles = await SteamUtils.getMaFiles()
  const elem = maFiles[login]

  if (elem) {
    return await SteamUtils.getGuardCode(elem?.shared_secret)
  } else {
    return 'Аккаунт не найден'
  }
}

export const openInBrowser = async (login: string): Promise<string> => {
  try {
    const user = SteamUtils.users[login]

    const url = 'https://steamcommunity.com/'
    const win = new BrowserWindow({
      width: 800,
      height: 600
    })

    await setCookiesToWindow(win, user.cookies)

    win.loadURL(url)

    return 'ok'
  } catch {
    return 'no ok'
  }
}

export const createClient = async (login: string): Promise<string> => {
  return SteamUtils.createClient(login)
}

export const getTradeOffers = async (login: string): Promise<ITradeOffer[]> => {
  return SteamUtils.getTradeOffers(login)
}

export const acceptTradeOffer = async (login: string, tradeOfferId: string): Promise<unknown> => {
  return SteamUtils.acceptTradeOffer(login, tradeOfferId)
}
