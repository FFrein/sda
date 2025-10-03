import { Button, List } from '@mui/material'
import { AccountApi } from '@renderer/api/api'
import useDataLoader from '@renderer/hooks/useLoadData'
import { IAccountOptions, IMobileConfirmation } from '@renderer/models/common/api'
import { useEffect, useState } from 'react'
import { TradeOffer } from '../TradeOffer/TradeOffer'
import { MobileConfirmation } from '../MobileConfirmation/MobileConfirmation'

export interface TradeOffersListProps {
  account: IAccountOptions
}

const TradeOffersList: React.FC<TradeOffersListProps> = ({ account }: TradeOffersListProps) => {
  const [confirmations, setConfirmations] = useState<IMobileConfirmation[]>()

  const { loadData, res } = useDataLoader(AccountApi.getTradeOffers)
  const { loadData: loadConfirmations, res: resC } = useDataLoader(
    AccountApi.getMobileConfirmations
  )

  useEffect(() => {
    console.log(res)
  }, [res])

  useEffect(() => {
    setConfirmations(resC)
  }, [resC])

  const getTradeOffersHandle = (): void => {
    loadData(account.login)
  }

  const getMobileConfirmationsHandle = (): void => {
    loadConfirmations(account.login)
  }

  const removeConfimation = (id: string) => {
    setConfirmations((prev) => prev.filter((item) => item.id !== id))
  }

  //const acceptTradeOfferHandle = (id: string): void => {}

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <Button onClick={getTradeOffersHandle}>Get Offers</Button>
      <Button onClick={getMobileConfirmationsHandle}>Get MobileConfirmations</Button>
      <List>
        {res &&
          res.map((e) => <TradeOffer key={e.id} title={e.title} desctiption={e.description} />)}
      </List>
      <List>
        {confirmations &&
          confirmations.map((e) => (
            <MobileConfirmation
              {...e}
              login={account.login}
              removeConfirmation={removeConfimation}
              key={e.id}
            />
          ))}
      </List>
    </div>
  )
}

export default TradeOffersList
