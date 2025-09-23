import React, { useState } from 'react'
import { Box, TextField, Button, Stack } from '@mui/material'
import { IAccountOptions } from '@renderer/models/common/api'
import useDataLoader from '@renderer/hooks/useLoadData'
import { AccountApi } from '@renderer/api/api'

type EditAccountProps = {
  account: IAccountOptions
}

const EditAccount: React.FC<EditAccountProps> = ({ account }) => {
  const [password, setPassword] = useState(account.password)

  const { loadData } = useDataLoader(AccountApi.updateAccountOptions)

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    loadData({ ...account, password })
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Stack spacing={2}>
        <TextField label="Логин" value={account.login} disabled fullWidth />

        <TextField
          label="Новый пароль"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
        />

        <Button type="submit" variant="contained" color="primary">
          Сохранить
        </Button>
      </Stack>
    </Box>
  )
}

export default EditAccount
