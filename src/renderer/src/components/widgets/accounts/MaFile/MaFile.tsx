import { Box, Button, Stack } from '@mui/material'
import { AccountApi } from '@renderer/api/api'
import { Form, useForm } from 'react-hook-form'

type FormValues = {
  login: string
  password: string
}

const MaFile: React.FC = () => {
  const { control, register, handleSubmit } = useForm<FormValues>()

  const onSubmitHandle = (data): void => {
    AccountApi.create2FA(data)
  }

  return (
    <Box>
      <Form control={control} onSubmit={handleSubmit(onSubmitHandle)}>
        <Stack>
          <label>Login</label>
          <input {...register('login')}></input>
          <label>Password</label>
          <input {...register('password')}></input>
          <Button type="submit">Создать</Button>
        </Stack>
      </Form>
    </Box>
  )
}

export default MaFile
