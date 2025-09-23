import { BrowserWindow } from 'electron'

export const setCookiesToWindow = async (
  win: BrowserWindow,
  rawCookies: string[]
): Promise<void> => {
  for (const rawCookie of rawCookies) {
    const [name, value] = rawCookie.split('=')

    if (!name || !value?.trim()) {
      console.warn('Пропускаем пустую куку:', rawCookie)
      continue
    }

    try {
      await win.webContents.session.cookies.set({
        url: 'https://steamcommunity.com',
        name: name.trim(),
        value: value.trim(),
        path: '/',
        secure: true,
        httpOnly: false
      })
    } catch (err) {
      console.error('Ошибка при установке куки', name, err)
    }
  }
}
