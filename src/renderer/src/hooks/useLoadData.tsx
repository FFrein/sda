import { useState } from 'react'

interface IDataLoaderResult<TResponse, TParams> {
  loadData: (options: TParams) => Promise<void>
  res: TResponse | undefined
  isLoading: boolean
}

const useDataLoader = <TResponse, TParams = unknown>(
  request: (options?: TParams) => Promise<TResponse>
): IDataLoaderResult<TResponse, TParams> => {
  const [res, setRes] = useState<TResponse>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const loadData = async (options?: TParams): Promise<void> => {
    try {
      setIsLoading(true)
      const data = await request(options)
      setRes(data)
    } catch (e: unknown) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    loadData,
    res,
    isLoading
  }
}

export default useDataLoader
