import { mainWindow } from '..'

export const sendNotify = (text: string): void => {
  mainWindow.webContents.send('backendNotify', text)
}
