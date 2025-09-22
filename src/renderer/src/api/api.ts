import { IAccount } from '@renderer/models/common/api'

export const AccountApi = {
  getAccountList: (): Promise<IAccount[]> => window.electron.ipcRenderer.invoke('getAccounts'),
  getGuard: (id: string) => window.electron.ipcRenderer.invoke('getGuard', id)
}
