import { ipcMain } from 'electron'

import * as ProgrammController from '@main/controllers/programm.controller'

ipcMain.handle('settings', ProgrammController.settings)
