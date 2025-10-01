import { AccountApi } from '@renderer/api/api'
import { DialogHandle } from '@renderer/components/widgets/Dialog'
import { ACCOUNTS_PER_PAGE } from '@renderer/constants/constants'
import useDataLoader from '@renderer/hooks/useLoadData'
import { IAccountOptions } from '@renderer/models/common/api'
import { useEffect, useMemo, useRef, useState } from 'react'
import Confirmations from '../../Confirmations'
import EditAccount from '../../Edit'
import Offers from '../../Offers'

export interface IUseAccountList {
  dialogHandleRef: React.RefObject<DialogHandle | undefined>
  currentItems: IAccountOptions[]
  totalPages: number
  page: number
  setPage: React.Dispatch<React.SetStateAction<number>>
  setType: React.Dispatch<React.SetStateAction<string>>
  type: string
  openDialogHandle: (type: string, acc: IAccountOptions) => void
  renderDialog: () => React.ReactNode
}

export const useAccountsList = (): IUseAccountList => {
  const [page, setPage] = useState<number>(1)
  const [type, setType] = useState('Code')
  const [account, setAccount] = useState<IAccountOptions>({} as IAccountOptions)

  const { loadData, res } = useDataLoader(AccountApi.getAccountList)

  useEffect(() => {
    loadData({})
  }, [])

  const dialogHandleRef = useRef<DialogHandle>(undefined)

  const currentItems = useMemo(() => {
    if (res) {
      const start = (page - 1) * ACCOUNTS_PER_PAGE
      const end = start + ACCOUNTS_PER_PAGE
      return res.slice(start, end)
    }
    return []
  }, [res, page])

  const totalPages = Math.ceil((res?.length || 0) / ACCOUNTS_PER_PAGE)

  const renderDialog = (): React.ReactNode => {
    switch (type) {
      //TODO сделать enum с вариантами
      case 'Code': {
        return <Confirmations account={account} />
      }
      case 'Edit': {
        return <EditAccount account={account} />
      }
      case 'Offers': {
        return <Offers account={account} />
      }
      default: {
        return <p>Not Found</p>
      }
    }
  }

  const openDialogHandle = (type: string, acc: IAccountOptions): void => {
    setType(type)
    setAccount(acc)
    if (dialogHandleRef) {
      dialogHandleRef?.current?.openDialog()
    }
  }

  return {
    dialogHandleRef,
    currentItems,
    totalPages,
    page,
    setPage,
    setType,
    type,
    openDialogHandle,
    renderDialog
  }
}
