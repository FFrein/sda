import { IconButton, ListItem, ListItemAvatar, ListItemText } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import styles from './styles.module.scss'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import { Link } from '@tanstack/react-router'
import { IAccount } from '@renderer/models/common/api'

const Account: React.FC<IAccount> = ({ name, id }: IAccount) => {
  return (
    <ListItem
      className={styles.item}
      secondaryAction={
        <div>
          <IconButton edge="end" aria-label="delete">
            <EditIcon />
          </IconButton>
        </div>
      }
    >
      <Link to="/confirmations/$id" params={{ id: id }}>
        <ListItemAvatar>
          <AccountCircleOutlinedIcon />
        </ListItemAvatar>
        <ListItemText primary={name} />
      </Link>
    </ListItem>
  )
}

export default Account
