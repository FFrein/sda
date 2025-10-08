import { Box, Stack } from '@mui/material'
import { Form, useForm } from 'react-hook-form'

const MaFile: React.FC = () => {
  const { control } = useForm()

  return (
    <Box>
      <Form control={control}>
        <Stack>
          <label>Login</label>
          <input></input>
          <label>Password</label>
          <input></input>
        </Stack>
      </Form>
    </Box>
  )
}

export default MaFile
