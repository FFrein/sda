import { ipcMain } from 'electron'

import * as OffersController from '@main/controllers/offers.controller'

ipcMain.handle('getTradeOffers', OffersController.getTradeOffers)
ipcMain.handle('acceptTradeOffer', OffersController.acceptTradeOffer)
ipcMain.handle('getMobileConfirmations', OffersController.getMobileConfirmations)
ipcMain.handle('actOnConfirmation', OffersController.actOnConfirmation)
