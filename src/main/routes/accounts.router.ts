import { ipcMain } from 'electron'

import * as AccountController from '@main/controllers/account.controller'

ipcMain.handle('getAccounts', AccountController.getAccounts)
ipcMain.handle('createAccount', AccountController.createAccount)
ipcMain.handle('getGuard', AccountController.getGuard)
ipcMain.handle('openInBrowser', AccountController.openInBrowser)
ipcMain.handle('updateAccountOptions', AccountController.updateAccountOptions)
