import { ProgrammApi } from '@renderer/api/api'
import useDataLoader from '@renderer/hooks/useLoadData'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

interface IUseSettingsHooks {
  register
  submitFormHandler
  isLoading
}

type FormValues = {
  maFileFolder: string
}

const useSettingsHooks = (): IUseSettingsHooks => {
  const { register, handleSubmit, setValue } = useForm<FormValues>()

  const { loadData, isLoading, res } = useDataLoader(ProgrammApi.getSettings)

  useEffect(() => {
    loadData({})
  }, [])

  useEffect(() => {
    if (res) {
      setValue('maFileFolder', res.maFileFolder)
    }
  }, [res])

  const submitFormHandler = handleSubmit((data) => {
    ProgrammApi.updateSettings(data)
  })

  return { register, submitFormHandler, isLoading }
}

export default useSettingsHooks
