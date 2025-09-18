import { Toolbar } from '@mui/material'
import { Tab } from './Tab'
import styles from './style.module.scss'

export const Navigation = () => {
  return (
    <div className={styles.navigation}>
      <Toolbar className={styles.toolbar}>
        <Tab link="/" text="Home" />
        <Tab link="/settings" text="Settings" />
      </Toolbar>
    </div>
  )
}
