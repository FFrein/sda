import { Box, List, Pagination } from '@mui/material'
import { IAccountOptions } from '@renderer/models/common/api'
import { useEffect, useState, useMemo, useRef } from 'react'
import Account from '@renderer/components/widgets/accounts/View/index'
import { AccountApi } from '@renderer/api/api'
import { ACCOUNTS_PER_PAGE } from '@renderer/constants/constants'
import useDataLoader from '@renderer/hooks/useLoadData'
import CustomDialog, { DialogHandle } from '../../dialog'
import EditAccount from '../Edit'
import Confirmations from '../Confirmations'

export interface AccountsListProps {}

export const AccountsList: React.FC<AccountsListProps> = ({}: AccountsListProps) => {
  const [page, setPage] = useState<number>(1)
  const [type, setType] = useState('Code')
  const [account, setAccount] = useState<number>(1)

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

  const renderDialog = (type: string) => {
    switch (type) {
      //TODO сделать enum с вариантами
      case 'Code': {
        return <Confirmations />
      }
      case 'Edit': {
        return <EditAccount account={account} />
      }
      case 'Offers': {
        return <></>
      }
      default:
        ;<p>Not Found</p>
    }
  }
  const openDialogHandle = (type: string, acc: unknown) => {
    setType(type)
    setAccount(acc)
    if (dialogHandleRef) {
      dialogHandleRef?.current?.openDialog()
    }
  }

  return (
    <Box
      sx={{
        height: '100%', // Занять всю высоту родителя\
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <List
        sx={{
          flexGrow: 1,
          overflowY: 'auto'
        }}
      >
        {currentItems.map((acc: IAccountOptions) => (
          <Account key={acc.login} account={acc} openDialog={openDialogHandle} />
        ))}
      </List>
      {totalPages > 1 && (
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
          sx={{
            mt: 2,
            display: 'flex',
            justifyContent: 'center',
            '& .MuiPaginationItem-root': {
              color: 'red'
            },
            '& .Mui-selected': {
              color: 'white',
              backgroundColor: 'blue'
            }
          }}
        />
      )}

      <CustomDialog ref={dialogHandleRef} title={'Редактирование аккаунта'}>
        {renderDialog(type)}
      </CustomDialog>
    </Box>
  )
}
