import { Button } from '@mui/material'
import { AccountApi } from '@renderer/api/api'
import { IAccountOptions } from '@renderer/models/common/api'
import { useState, useEffect } from 'react'

export interface GuardCodeProps {
  account: IAccountOptions
}

const GuardCode: React.FC<GuardCodeProps> = ({ account }: GuardCodeProps) => {
  const [code, setCode] = useState('')
  const [ttl, setTtl] = useState(30)

  const fetchCode = async (): Promise<void> => {
    const data = await AccountApi.getGuard(account.login)
    setCode(data.code)
    setTtl(data.ttl)
  }

  useEffect(() => {
    fetchCode()

    const interval = setInterval(() => {
      setTtl((prev) => {
        if (prev <= 1) {
          fetchCode()
          return 30
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const progress = (ttl / 30) * 100

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <Button
        onClick={fetchCode}
        sx={{
          width: 200,
          height: 50,
          background: `linear-gradient(to right, #4caf50 ${progress}%, #ccc ${progress}%)`,
          color: '#fff',
          fontWeight: 'bold'
        }}
      >
        {code || 'код'}
      </Button>
      <p>Следующий код через: {ttl} сек</p>
    </div>
  )
}

export default GuardCode
