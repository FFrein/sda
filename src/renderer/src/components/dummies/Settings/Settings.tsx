import { Stack } from '@mui/material'
import useSettingsHooks from './hooks/useSettingsHook'

const Settings: React.FC = () => {
  const { submitFormHandler, register } = useSettingsHooks()

  return (
    <form onSubmit={submitFormHandler}>
      <Stack>
        <label>maFileFolder</label>
        <input {...register('maFileFolder')}></input>
        <label>optionsFolder</label>
        <input {...register('optionsFolder')}></input>

        <button type="submit">Сохранить</button>
      </Stack>
    </form>
  )
}

export default Settings
