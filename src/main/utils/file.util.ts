import { IMaFile } from '@main/models/server'
import fs from 'fs'
import path from 'path'

export const readMaFile = async (fileName: string, dir: string): Promise<IMaFile> => {
  const maFilePath = path.join(dir, fileName)
  const maFile = JSON.parse(fs.readFileSync(maFilePath, 'utf8')) as IMaFile

  return maFile
}

export const readFileListInDir = (directoryPath: string, ext?: Array<string>): Array<string> => {
  try {
    if (ext && ext?.length > 0) {
      return fs.readdirSync(directoryPath).filter((file) => ext?.includes(path.extname(file)))
    } else {
      return fs.readdirSync(directoryPath)
    }
  } catch (err) {
    // TODO: отправить ошибку на фронт
    return []
  }
}
