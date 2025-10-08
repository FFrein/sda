import { IGuardCode, IAccountOptions } from '../models/api'
import * as SteamUtils from '@main/utils/steam/steam.util'
import * as MaFiles from '@main/utils/steam/maFile.util'
import * as AccountOptions from '@main/utils/steam/accountOptions.util'
import { BrowserWindow } from 'electron'
import { setCookiesToWindow } from '@main/utils/window.util'
import Notification from '@main/utils/notify.util'
import { users } from '@main/store/store'

export const getAccount = async (): Promise<IAccountOptions[]> => {
  const maFiles = await MaFiles.load()

  const result = [] as IAccountOptions[]

  for (const acc in maFiles) {
    const login = maFiles[acc].account_name
    //TODO наверное стоит передавть isAuth
    result.push({
      login: login
    })
  }

  return result
}

export const createAccount = (data: IAccountOptions): void => {
  try {
    console.log(data)
  } catch (e: unknown) {
    console.log(e)
  }
}

export const updateAccount = (data: IAccountOptions): void => {
  AccountOptions.update(data)
}

export const deleteAccount = (login: string): string => {
  return `deleteAccount ${login}`
}

export const getGuard = async (login: string): Promise<string | IGuardCode> => {
  const maFiles = await MaFiles.get()
  const elem = maFiles[login]

  if (elem) {
    return await SteamUtils.getGuardCode(elem?.shared_secret)
  } else {
    return 'Аккаунт не найден'
  }
}

export const openInBrowser = async (login: string): Promise<void> => {
  try {
    const user = users[login]

    if (!user) {
      throw `Клиент для пользователя ${login} не создан`
    }
    if (!user.cookies) {
      throw `cookies для пользователя ${login} не созданы`
    }

    const url = 'https://steamcommunity.com/'
    const win = new BrowserWindow({
      width: 800,
      height: 600
    })

    await setCookiesToWindow(win, user.cookies)

    win.loadURL(url)
  } catch (e) {
    Notification.error(`Открытие в браузере`, `${e}`)
  }
}

export const createClient = async (login: string): Promise<void> => {
  await SteamUtils.createClient(login)
}
