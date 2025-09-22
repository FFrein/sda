import { IAccount, IGuard } from '@main/models/api'
import * as AccountService from '@main/services/account.service.ts'

export const getAccounts = async (): Promise<IAccount[]> => {
  return await AccountService.getAccount()
}

export const createAccount = async (_, data: IAccount): Promise<string> => {
  return await AccountService.createAccount(data)
}

export const deleteAccount = async (_, id): Promise<string> => {
  return await AccountService.createAccount(id)
}

export const getGuard = async (_, id): Promise<string | IGuard> => {
  return await AccountService.getGuardCode(id)
}
