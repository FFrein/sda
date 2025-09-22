import { IGuardCode } from '@main/models/api'
import SteamTotp from 'steam-totp'

let globalOffset: number | null = null

export const initSteamOffset = (): Promise<number> => {
  return new Promise((resolve, reject) => {
    SteamTotp.getTimeOffset(async (err, offset) => {
      if (err) return reject(err)
      if (offset instanceof Promise) {
        globalOffset = await offset
        resolve(await offset)
      } else {
        globalOffset = offset
        resolve(offset)
      }
    })
  })
}

// Генерация кода с учётом глобального offset
export const getLoginCode = async (secret: string): Promise<IGuardCode> => {
  if (globalOffset === null) {
    await initSteamOffset()
  }

  const code = SteamTotp.generateAuthCode(secret, globalOffset)
  const now = Math.floor(Date.now() / 1000)
  const ttl = 30 - ((now + globalOffset!) % 30)

  return { code, ttl }
}
