import { Box, List } from '@mui/material'
import { IAccountOptions } from '@renderer/models/common/api'
import Account from '@renderer/components/widgets/accounts/Account/index'
import { useAccountsList } from './hooks/useAccountsList'
import CustomDialog from '../../Dialog'
import CustomPagination from '../../Pagination/Pagination'

export interface AccountsListProps {}

export const AccountsList: React.FC<AccountsListProps> = () => {
  const {
    dialogHandleRef,
    currentItems,
    totalPages,
    page,
    setPage,
    openDialogHandle,
    renderDialog
  } = useAccountsList()

  return (
    <Box
      sx={{
        height: '100%',
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
      {totalPages > 1 && <CustomPagination totalPages={totalPages} page={page} setPage={setPage} />}

      <CustomDialog ref={dialogHandleRef} title={'Информация об аккаунте'}>
        {renderDialog()}
      </CustomDialog>
    </Box>
  )
}
