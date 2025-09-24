import { Button } from '@mui/material'
import { AccountApi } from '@renderer/api/api'
import useDataLoader from '@renderer/hooks/useLoadData'
import { IAccountOptions } from '@renderer/models/common/api'
import { useEffect } from 'react'

export interface ConfirmationsProps {
  account: IAccountOptions
}

const Offers: React.FC<ConfirmationsProps> = ({ account }: ConfirmationsProps) => {
  const { loadData, res } = useDataLoader(AccountApi.getTradeOffers)

  useEffect(() => {
    console.log(res)
  }, [res])

  const createClientHandle = async (): void => {
    const data = await AccountApi.createClient(account.login)
    console.log(data)
  }

  const getTradeOffersandle = (): void => {
    loadData(account.login)
  }

  //const acceptTradeOfferHandle = (id: string): void => {}

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <Button onClick={createClientHandle}>Create client</Button>
      <Button onClick={getTradeOffersandle}>Get Offers</Button>
    </div>
  )
}

export default Offers
