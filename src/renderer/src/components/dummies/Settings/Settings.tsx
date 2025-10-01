import useSettingsHooks from './hooks/useSettingsHook'

const Settings: React.FC = () => {
  const { submitFormHandler, register } = useSettingsHooks()

  return (
    <form onSubmit={submitFormHandler}>
      <input {...register('maFileFolder')}></input>
      <input {...register('optionsFolder')}></input>

      <button type="submit">Сохранить</button>
    </form>
  )
}

export default Settings
