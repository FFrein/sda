import { IStoreStore, store } from '@main/store/store'

export const getSettings = (): IStoreStore => {
  return store.store as IStoreStore
}

export const updateSettings = (data: IStoreStore): void => {
  for (const e in data) {
    store.set(e, data[e])
  }
}
