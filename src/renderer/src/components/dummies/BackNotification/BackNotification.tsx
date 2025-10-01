import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const BackNotification: React.FC = () => {
  const [message, setMessage] = useState()

  window.electron.ipcRenderer.on('backendNotify', (_, arg) => {
    setMessage(arg)
  })

  useEffect(() => {
    toast(message)
  }, [message])

  return <></>
}

export default BackNotification
