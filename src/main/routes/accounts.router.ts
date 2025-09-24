import { ipcMain } from 'electron'

import * as AccountController from '@main/controllers/account.controller'

//Это больше про конфигурацию аккаунтов
ipcMain.handle('getGuard', AccountController.getGuard)
ipcMain.handle('getAccounts', AccountController.getAccounts)
ipcMain.handle('createAccount', AccountController.createAccount)
ipcMain.handle('updateAccountOptions', AccountController.updateAccountOptions)
ipcMain.handle('openInBrowser', AccountController.openInBrowser)

//Это больше про функции доступные авторизованному аккаунту
//МБ другой контроллер?
ipcMain.handle('createClient', AccountController.createClient)
ipcMain.handle('getTradeOffers', AccountController.getTradeOffers)
ipcMain.handle('acceptTradeOffer', AccountController.acceptTradeOffer)
