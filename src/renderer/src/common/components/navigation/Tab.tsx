import { Button, IconButton } from '@mui/material'
import { Link } from '@tanstack/react-router'

export const Tab = ({ link, text }) => {
  return (
    <Link to={link}>
      <Button variant="outlined">{text}</Button>
    </Link>
  )
}
