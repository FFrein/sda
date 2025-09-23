import { Box } from '@mui/material'
import { AccountsList } from '@renderer/components/widgets/accounts/List/index'

const Home: React.FC = () => {
  return (
    <Box width={'100vw'} height={'100vh'} padding={'100px 50px'}>
      <AccountsList />
    </Box>
  )
}

export default Home
