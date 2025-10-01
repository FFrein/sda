import { IAccountOptions } from '@renderer/models/common/api'

export const AccountApi = {
  getAccountList: (): Promise<IAccountOptions[]> =>
    window.electron.ipcRenderer.invoke('getAccounts'),
  getGuard: (id: string) => window.electron.ipcRenderer.invoke('getGuard', id),
  openInBrowser: (login: string): Promise<void> =>
    window.electron.ipcRenderer.invoke('openInBrowser', login),
  updateAccountOptions: (data: IAccountOptions): Promise<IAccountOptions> =>
    window.electron.ipcRenderer.invoke('updateAccountOptions', data),
  createClient: (login: string): Promise<string> =>
    window.electron.ipcRenderer.invoke('createClient', login),
  getTradeOffers: (login: string): Promise<unknown> =>
    window.electron.ipcRenderer.invoke('getTradeOffers', login),
  acceptTradeOffer: (data: { login: string; tradeOfferId: string }): Promise<unknown> =>
    window.electron.ipcRenderer.invoke('acceptTradeOffer', data)
}

export const ProgrammApi = {
  exit: () => window.electron.ipcRenderer.send('exit'),
  getSettings: () => window.electron.ipcRenderer.invoke('getSettings'),
  updateSettings: (data: { maFileFolder: string }) =>
    window.electron.ipcRenderer.invoke('updateSettings', data)
}
