import { AccountOptionRecords } from '@main/models/api'
import { IMaFileRecord, UserRecords } from '@main/models/server'
import * as AccountOptions from '@main/utils/steam/accountOptions.util'
import StorePkg from 'electron-store'
const Store = StorePkg.default

export interface IStoreStore {
  maFileFolder: string
}

export const store = new Store()

export const maFiles: IMaFileRecord = {}
export const _accountsOptions: AccountOptionRecords = {}
export const accountsOptions = new Proxy(_accountsOptions, {
  set(target, prop, val) {
    if (typeof val == 'object') {
      target[prop] = val
      AccountOptions.save()

      return true
    } else {
      return false
    }
  }
})
export const users: UserRecords = {}
