import { List, Pagination } from '@mui/material'
import { IAccount } from '@renderer/models/common/api'
import { useEffect, useState, useMemo } from 'react'
import Account from '@renderer/components/widgets/Accounts/Element/index'
import { AccountApi } from '@renderer/api/api'
import { ACCOUNTS_PER_PAGE } from '@renderer/constants/constants'
import useDataLoader from '@renderer/hooks/useLoadData'

export const AccountsList: React.FC = () => {
  const [page, setPage] = useState<number>(1)

  const { loadData, res, isLoading } = useDataLoader(AccountApi.getAccountList)

  useEffect(() => {
    loadData({})
  }, [])

  // отфильтрованные элементы для текущей страницы
  const currentItems = useMemo(() => {
    if (res) {
      const start = (page - 1) * ACCOUNTS_PER_PAGE
      const end = start + ACCOUNTS_PER_PAGE
      return res.slice(start, end)
    }
    return []
  }, [res, page])

  const totalPages = Math.ceil(res?.length || 0 / ACCOUNTS_PER_PAGE)

  return (
    <>
      <List>
        {currentItems.map((e: IAccount) => (
          <Account key={e.id} id={e.id} name={e.name} img={undefined} />
        ))}
      </List>

      {totalPages > 1 && (
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
          sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
        />
      )}
    </>
  )
}
