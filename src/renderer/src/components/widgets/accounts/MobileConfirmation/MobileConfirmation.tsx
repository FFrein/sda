import { Button, ListItem, Stack } from '@mui/material'
import { IMobileConfirmation } from '@renderer/models/common/api'
import styles from './styles.module.scss'
import { AccountApi } from '@renderer/api/api'

interface MobileConfirmationrops extends IMobileConfirmation {
  login: string
  removeConfirmation: (id: string) => void
}

export const MobileConfirmation: React.FC<MobileConfirmationrops> = (
  props: MobileConfirmationrops
) => {
  const acceptConfirmationHandle = async (): Promise<void> => {
    const resp = await AccountApi.actOnConfirmation({
      login: props.login,
      confirmationId: props.id,
      type: true
    })
    if (resp) props.removeConfirmation(props.id)

    console.log(resp)
  }
  const declineConfirmationHandle = async (): Promise<void> => {
    const resp = await AccountApi.actOnConfirmation({
      login: props.login,
      confirmationId: props.id,
      type: false
    })
    if (resp) props.removeConfirmation(props.id)

    console.log(resp)
  }
  return (
    <ListItem>
      <Stack>
        <Stack direction="row" spacing={2}>
          <img className={styles.avatar} src={props.icon} alt="icon" />

          <Stack direction="column" spacing={2}>
            <Stack direction="row" spacing={2}>
              <p>{props.title}</p>
              <p>{props.creator}</p>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Button onClick={acceptConfirmationHandle} variant="contained" color="success">
                Yes
              </Button>
              <Button onClick={declineConfirmationHandle} variant="outlined" color="error">
                No
              </Button>
            </Stack>
          </Stack>
        </Stack>
        <Stack>
          <p>{props.receiving}</p>
          <p>{props.sending}</p>
        </Stack>
      </Stack>
    </ListItem>
  )
}
