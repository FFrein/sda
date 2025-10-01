import StorePkg from 'electron-store'
const Store = StorePkg.default

export interface IStoreStore {
  maFileFolder: string
}

export const store = new Store()
