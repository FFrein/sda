import { readFileListInDir, readMaFile } from '@main/utils/file.util'
import { IGuard, IAccount } from '../models/api'
import { IMaFile } from '@main/models/server'
import { getLoginCode } from '@main/utils/steam.util'

const maFiles: IMaFile[] = []

export const getAccount = async (): Promise<IAccount[]> => {
  const data2 = readFileListInDir('/home/a485/Документы/sda', ['.maFile'])
  const result: IAccount[] = []

  data2.forEach(async (e) => {
    const elem = await readMaFile(e, '/home/a485/Документы/sda')
    maFiles.push(elem)
    result.push({ name: elem.account_name, id: elem.Session.SteamID })
  })

  return result
}

export const createAccount = (data: IAccount): string => {
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

export const deleteAccount = (id: string): string => {
  //accounts = accounts.filter((e: IAccount) => e != id)
  return 'ok'
}

export const getGuardCode = async (id: string): Promise<string | IGuard> => {
  const elem = maFiles.find((e) => e.Session.SteamID.toString() == id)
  if (elem) {
    return await getLoginCode(elem?.shared_secret)
  } else {
    return 'Аккаунт не найден'
  }
}
