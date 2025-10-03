import { Button, ListItem, Stack } from '@mui/material'

interface TradeOfferProps {
  title: string
  desctiption: string
}

export const TradeOffer: React.FC<TradeOfferProps> = ({ title, desctiption }: TradeOfferProps) => {
  return (
    <ListItem>
      <Stack direction="row" spacing={2}>
        <p>{title}</p>
        <p>{desctiption}</p>
        <Button variant="contained" color="success">
          Принять
        </Button>
        <Button variant="outlined" color="error">
          Отклонить2
        </Button>
      </Stack>
    </ListItem>
  )
}
