import { Button } from '@mui/material'
import { Link } from '@tanstack/react-router'

interface TabProps {
  link: string
  text: string
}

export const Tab: React.FC<TabProps> = ({ link, text }: TabProps) => {
  return (
    <Link to={link}>
      <Button variant="outlined">{text}</Button>
    </Link>
  )
}
