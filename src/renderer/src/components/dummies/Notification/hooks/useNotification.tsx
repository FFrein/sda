import { useAccountsStore } from '@renderer/stores/accounts.store'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

interface IUseNotification {}

const useNotification = (): IUseNotification => {
  const [message, setMessage] = useState<string>()
  const { setAccountAuth } = useAccountsStore()

  window.electron.ipcRenderer.on('notification ', (_, arg) => {
    setMessage(arg)
  })

  window.electron.ipcRenderer.on('error', (_, arg) => {
    setMessage(`${arg.title} ${arg.description}`)
  })

  window.electron.ipcRenderer.on('accountLoggedOn', (_, arg) => {
    setMessage(`Аккаунт ${arg.login} авторизован`)
    setAccountAuth(arg.login, true)
  })

  window.electron.ipcRenderer.on('accountLoggedOff', (_, arg) => {
    setMessage(`Аккаунт ${arg.login} отключен`)
    setAccountAuth(arg.login, false)
  })

  useEffect(() => {
    toast(message)
  }, [message])

  return {}
}

export default useNotification
