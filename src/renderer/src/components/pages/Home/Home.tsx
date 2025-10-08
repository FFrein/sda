import { Box, Button } from '@mui/material'
import { AccountsList } from '@renderer/components/widgets/accounts/List/index'
import MaFile from '@renderer/components/widgets/accounts/MaFile/MaFile'
import CustomDialog, { DialogHandle } from '@renderer/components/widgets/Dialog'
import { useRef } from 'react'

const Home: React.FC = () => {
  const dialogHandleRef = useRef<DialogHandle>(undefined)

  const openDialogHandle = (): void => {
    if (dialogHandleRef.current) {
      dialogHandleRef.current.openDialog()
    }
  }

  return (
    <Box width={'100vw'} height={'100vh'} padding={'100px 50px'}>
      <Box>
        <Button onClick={openDialogHandle}>creat 2FA</Button>
      </Box>
      <AccountsList />
      <CustomDialog ref={dialogHandleRef}>
        <MaFile />
      </CustomDialog>
    </Box>
  )
}

export default Home
