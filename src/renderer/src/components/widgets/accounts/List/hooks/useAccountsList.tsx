import { DialogHandle } from '@renderer/components/widgets/Dialog'
import { ACCOUNTS_PER_PAGE } from '@renderer/constants/constants'
import { IAccountOptions } from '@renderer/models/common/api'
import { useMemo, useRef, useState } from 'react'
import GuardCode from '../../GuardCode'
import EditAccount from '../../Edit'
import Offers from '../../TradeOffersList'
import { useAccountsStore } from '@renderer/stores/accounts.store'

export interface IUseAccountList {
  dialogHandleRef: React.RefObject<DialogHandle | undefined>
  currentItems: IAccountOptions[]
  totalPages: number
  page: number
  type: EAccDialog
  setPage: React.Dispatch<React.SetStateAction<number>>
  setType: React.Dispatch<React.SetStateAction<EAccDialog>>
  openDialogHandle: (type: EAccDialog, acc: IAccountOptions) => void
  renderDialog: () => React.ReactNode
}

export enum EAccDialog {
  Code = 'Code',
  Edit = 'Edit',
  Offers = 'Offers'
}

export const useAccountsList = (): IUseAccountList => {
  const [page, setPage] = useState<number>(1)
  const [type, setType] = useState<EAccDialog>(EAccDialog.Code)
  const [account, setAccount] = useState<IAccountOptions>({} as IAccountOptions)

  const { accounts } = useAccountsStore()

  const dialogHandleRef = useRef<DialogHandle>(undefined)

  const currentItems = useMemo(() => {
    if (accounts) {
      const start = (page - 1) * ACCOUNTS_PER_PAGE
      const end = start + ACCOUNTS_PER_PAGE
      return accounts.slice(start, end)
    }
    return []
  }, [accounts, page])

  const totalPages = Math.ceil((accounts?.length || 0) / ACCOUNTS_PER_PAGE)

  const renderDialog = (): React.ReactNode => {
    switch (type) {
      case EAccDialog.Code: {
        return <GuardCode account={account} />
      }
      case EAccDialog.Edit: {
        return <EditAccount account={account} />
      }
      case EAccDialog.Offers: {
        return <Offers account={account} />
      }
      default: {
        return <p>Not Found</p>
      }
    }
  }

  const openDialogHandle = (type: EAccDialog, acc: IAccountOptions): void => {
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
    type,
    setPage,
    setType,
    openDialogHandle,
    renderDialog
  }
}
