import { Pagination } from '@mui/material'
import { Dispatch } from 'react'

export interface CustomPaginatorProps {
  totalPages: number
  page: number
  setPage: Dispatch<number>
}
const CustomPagination: React.FC<CustomPaginatorProps> = ({
  totalPages,
  page,
  setPage
}: CustomPaginatorProps) => {
  return (
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
  )
}

export default CustomPagination
