import { ipcMain } from 'electron'

import * as AccountController from '@main/controllers/account.controller.ts'

ipcMain.handle('getAccounts', AccountController.getAccounts)
ipcMain.handle('createAccount', AccountController.createAccount)
ipcMain.handle('deleteAccount', AccountController.deleteAccount)
ipcMain.handle('getGuard', AccountController.getGuard)
