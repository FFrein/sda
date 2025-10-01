import { ipcMain } from 'electron'

import * as ProgrammController from '@main/controllers/programm.controller'

ipcMain.handle('getSettings', ProgrammController.getSettings)
ipcMain.handle('updateSettings', ProgrammController.updateSettings)
