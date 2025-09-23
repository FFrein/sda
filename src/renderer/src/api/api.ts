import { IAccountOptions } from '@renderer/models/common/api'

export const AccountApi = {
  getAccountList: (): Promise<IAccountOptions[]> =>
    window.electron.ipcRenderer.invoke('getAccounts'),
  getGuard: (id: string) => window.electron.ipcRenderer.invoke('getGuard', id),
  openInBrowser: (login: string): Promise<void> =>
    window.electron.ipcRenderer.invoke('openInBrowser', login),
  updateAccountOptions: (data: IAccountOptions): Promise<IAccountOptions> =>
    window.electron.ipcRenderer.invoke('updateAccountOptions', data)
}

export const ProgrammApi = {
  exit: () => window.electron.ipcRenderer.send('exit')
}
