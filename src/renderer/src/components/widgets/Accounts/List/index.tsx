import { List } from '@mui/material'
import { IAccount } from '@renderer/models/common/api'
import { useState } from 'react'
import Account from '@renderer/components/widgets/Accounts/Element/index'

export const AccountsList: React.FC = () => {
  const [accocunts, setAccounts] = useState<IAccount[]>([])

  const hetAccountsHandle = async (): Promise<void> => {
    const data = await window.electron.ipcRenderer.invoke('getAccounts')
    if (data) {
      setAccounts(data)
    }
  }

  hetAccountsHandle()

  return (
    <List>
      {accocunts.map((e: IAccount) => (
        <Account key={e.id} id={e.id} name={e.name} img={undefined} />
      ))}
    </List>
  )
}
