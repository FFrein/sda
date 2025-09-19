import { ipcMain } from 'electron'

import AccountController from '@main/controllers/account.controller.ts'

ipcMain.handle('getAccounts', AccountController.getAccounts)
ipcMain.handle('createAccount', AccountController.gcreateAccount)
ipcMain.handle('deleteAccount', AccountController.gdeleteAccount)
