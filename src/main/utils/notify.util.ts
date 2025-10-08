import { mainWindow } from '..'

const Notification = {
  message: (text: string): void => {
    mainWindow.webContents.send('notification', text)
  },
  error: (title: string, description: string): void => {
    mainWindow.webContents.send('error', { title, description })
  },
  accountLoggedOn: (login: string): void => {
    mainWindow.webContents.send('accountLoggedOn', { login })
  },
  accountLoggedOff: (login: string, msg: unknown): void => {
    mainWindow.webContents.send('accountLoggedOff', { login, msg })
  }
}

export default Notification
