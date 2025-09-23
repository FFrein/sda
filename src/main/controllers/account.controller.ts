import { IAccountOptions, IGuardCode } from '@main/models/api'
import * as AccountService from '@main/services/account.service'

//TODO порнуха
export const getAccounts = async (): Promise<IAccountOptions[]> => {
  return AccountService.getAccount()
}

export const createAccount = async (_, data: IAccountOptions): Promise<string> => {
  return await AccountService.createAccount(data)
}

export const getGuard = async (_, login): Promise<string | IGuardCode> => {
  return await AccountService.getGuard(login)
}

export function openInBrowser(_, login: string): Promise<string> {
  return AccountService.openInBrowser(login)
}

export function updateAccountOptions(_, data: IAccountOptions): Promise<IAccountOptions> {
  return AccountService.updateAccount(data)
}
