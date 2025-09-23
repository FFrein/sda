import {
  forwardRef,
  ForwardRefRenderFunction,
  ReactNode,
  useImperativeHandle,
  useState
} from 'react'
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'

export interface DialogHandle {
  openDialog: () => void
}

type CustomDialogProps = {
  children?: ReactNode
  title?: string
}

const CustomDialogRef: ForwardRefRenderFunction<DialogHandle | undefined, CustomDialogProps> = (
  props,
  ref
) => {
  const [open, setOpen] = useState(false)

  // Экспонируем методы наружу через ref
  useImperativeHandle(ref, () => ({
    openDialog: () => setOpen(true)
  }))

  const handleClose = (): void => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>{props.children}</DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined">
          Закрыть
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const CustomDialog = forwardRef(CustomDialogRef)

export default CustomDialog
