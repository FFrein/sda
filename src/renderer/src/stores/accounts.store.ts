import { AccountApi } from '@renderer/api/api'
import { IAccountOptions } from '@renderer/models/common/api'
import { create } from 'zustand'

type IAccountsStore = {
  accounts: IAccountOptions[]
  isLoading: boolean
  error: string | null
  setAccounts: (acc: unknown) => void
  fetchAccounts: () => Promise<void>
  setAccountAuth: (login: string, isAuth: boolean) => void
}

export const useAccountsStore = create<IAccountsStore>()((set) => {
  const store: IAccountsStore = {
    accounts: [],
    isLoading: false,
    error: null,

    setAccounts: (acc: unknown) => {
      console.log(acc)
    },

    fetchAccounts: async () => {
      set({ accounts: [], isLoading: true, error: null })
      try {
        const data = await AccountApi.getAccountList()
        set({ accounts: data, isLoading: false })
      } catch (e: any) {
        set({ error: e.message, isLoading: false })
      }
    },

    setAccountAuth: (login: string, isAuth: boolean) =>
      set((state) => {
        const acc = state.accounts.find((e) => e.login === login)
        if (!acc) return state // ничего не меняем, если аккаунт не найден

        return {
          accounts: state.accounts.map((e) => (e.login === login ? { ...e, isAuth } : e))
        }
      })
  }

  // авто-вызов
  store.fetchAccounts()

  // где сделать обработчик событий

  return store
})
