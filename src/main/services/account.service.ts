import { IAccount } from '../models/api'

let accounts: IAccount[] = [{ name: 'Account 1', id: '123123' }]

export const getAccount = (): IAccount[] => {
  return accounts
}

export const createAccount = (data: IAccount): string => {
  try {
    accounts.push(data)
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
  accounts = accounts.filter((e: IAccount) => e != id)
  return 'ok'
}
