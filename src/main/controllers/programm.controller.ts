import * as ProgrammService from '@main/services/programm.service'
import { IStoreStore } from '@main/store/store'

export const getSettings = (): IStoreStore => {
  return ProgrammService.getSettings()
}

export const updateSettings = (_, data): void => {
  ProgrammService.updateSettings(data)
}
