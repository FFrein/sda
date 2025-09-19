import { IAccount } from '@main/models/api'
import AccountService from '@main/services/account.service.ts'

export const getAccounts = (): IAccount[] => {
  return AccountService.getAccount()
}

export const createAccount = (_, data: IAccount): string => {
  return AccountService.createAccount(data)
}

export const deleteAccount = (_, id): string => {
  return AccountService.createAccount(id)
}
