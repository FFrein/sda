import { ipcMain } from 'electron'

import * as AccountController from '@main/controllers/account.controller'

//Это больше про конфигурацию аккаунтов
ipcMain.handle('getGuard', AccountController.getGuard)
ipcMain.handle('getAccounts', AccountController.getAccounts)
ipcMain.handle('create2FA', AccountController.create2FA)
ipcMain.handle('updateAccountOptions', AccountController.updateAccountOptions)
ipcMain.handle('openInBrowser', AccountController.openInBrowser)

//Это больше про функции доступные авторизованному аккаунту
//МБ другой контроллер?
ipcMain.handle('createClient', AccountController.createClient)
