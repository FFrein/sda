import fs from 'fs'
import path from 'path'

export const readJsonFile = async <T>(fileName: string, dir: string): Promise<T> => {
  const filePath = path.join(dir, fileName)
  const fileContent = fs.readFileSync(filePath, 'utf8')
  const data = JSON.parse(fileContent) as T
  return data
}

export const ensureFileExists = async (
  fileName: string,
  dir: string,
  defaultContent: string = '{}'
): Promise<string> => {
  const filePath = path.join(dir, fileName)

  try {
    await fs.promises.access(filePath, fs.constants.F_OK)
    return filePath
  } catch {
    await fs.promises.mkdir(dir, { recursive: true })
    await fs.promises.writeFile(filePath, defaultContent, 'utf8')
    return filePath
  }
}

export const saveFileAsJson = async (
  fileName: string,
  dir: string,
  data: unknown
): Promise<void> => {
  const filePath = path.join(dir, fileName)

  try {
    await fs.promises.mkdir(dir, { recursive: true })

    const jsonString = typeof data === 'string' ? data : JSON.stringify(data, null, 2)

    await fs.promises.writeFile(filePath, jsonString, 'utf8')
  } catch (error) {
    console.error(`Ошибка при сохранении JSON в ${fileName}:`, error)
    //throw error
  }
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
