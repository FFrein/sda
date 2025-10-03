import { IAccountOptions, IGuardCode, ITradeOffer } from '@main/models/api'
import * as AccountService from '@main/services/account.service'

//TODO порнуха
export const getAccounts = async (): Promise<IAccountOptions[]> => {
  return AccountService.getAccount()
}

export const createAccount = async (_, data: IAccountOptions): Promise<string> => {
  return AccountService.createAccount(data)
}

export const getGuard = async (_, login): Promise<string | IGuardCode> => {
  return AccountService.getGuard(login)
}

export function openInBrowser(_, login: string): Promise<string> {
  return AccountService.openInBrowser(login)
}

export function updateAccountOptions(_, data: IAccountOptions): Promise<IAccountOptions> {
  return AccountService.updateAccount(data)
}

export function createClient(_, login: string): Promise<string> {
  return AccountService.createClient(login)
}
