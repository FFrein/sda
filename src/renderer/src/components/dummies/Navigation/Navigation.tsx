import { Button, Toolbar } from '@mui/material'
import { Tab } from './Tab'
import styles from './style.module.scss'
import { ProgrammApi } from '@renderer/api/api'

export const Navigation: React.FC = () => {
  return (
    <div className={styles.navigation}>
      <Toolbar className={styles.toolbar}>
        <Tab link="/" text="Home" />
        <Tab link="/settings" text="Settings" />
        <Button variant="outlined" color="error" onClick={ProgrammApi.exit}>
          <p>Exit</p>
        </Button>
      </Toolbar>
    </div>
  )
}
