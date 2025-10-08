import { IAccountOptions, IGuardCode } from '@main/models/api'
import * as AccountService from '@main/services/account.service'

//TODO порнуха
export const getAccounts = async (): Promise<IAccountOptions[]> => {
  return AccountService.getAccount()
}

export const createAccount = (_, data: IAccountOptions): void => {
  AccountService.createAccount(data)
}

export const getGuard = async (_, login): Promise<string | IGuardCode> => {
  return AccountService.getGuard(login)
}

export function openInBrowser(_, login: string): void {
  AccountService.openInBrowser(login)
}

export function updateAccountOptions(_, data: IAccountOptions): void {
  AccountService.updateAccount(data)
}

export function createClient(_, login: string): void {
  AccountService.createClient(login)
}
