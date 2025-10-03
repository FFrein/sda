import { Box, Button, IconButton, ListItem, ListItemText } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import styles from './styles.module.scss'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import { IAccountOptions } from '@renderer/models/common/api'
import WebIcon from '@mui/icons-material/Web'
import useDataLoader from '@renderer/hooks/useLoadData'
import { AccountApi } from '@renderer/api/api'
import ArticleIcon from '@mui/icons-material/Article'

interface AccountProps {
  account: IAccountOptions
  openDialog: any
}

const Account: React.FC<AccountProps> = ({ account, openDialog }: AccountProps) => {
  const { loadData } = useDataLoader(AccountApi.openInBrowser)

  const openInBrowserHandle = (): void => {
    loadData(account.login)
  }

  const createClientHandle = async (): Promise<void> => {
    AccountApi.createClient(account.login)
  }

  return (
    <ListItem
      className={styles.item}
      secondaryAction={
        <div>
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={() => {
              openDialog('Edit', account)
            }}
          >
            <EditIcon />
          </IconButton>
        </div>
      }
    >
      <Box margin={'0 auto 0 0'} display={'flex'} alignItems={'center'}>
        <AccountCircleOutlinedIcon />
        <ListItemText primary={account.login} />
      </Box>
      <Box
        padding={'4px'}
        margin={'0 20px 0 0'}
        display={'flex'}
        flexDirection={'row'}
        gap={'8px'}
        alignItems={'center'}
      >
        <Button
          color={'primary'}
          onClick={() => {
            openDialog('Code', account)
          }}
        >
          Code
        </Button>
        <Button onClick={createClientHandle}>Create client</Button>

        <Button
          variant="outlined"
          color="info"
          onClick={() => {
            openDialog('Offers', account)
          }}
        >
          <ArticleIcon />
          <p>Offers</p>
        </Button>
        <Button variant="outlined" onClick={openInBrowserHandle}>
          <WebIcon />
          <p>Web</p>
        </Button>
      </Box>
    </ListItem>
  )
}

export default Account
