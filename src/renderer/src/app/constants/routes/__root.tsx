import BackNotification from '@renderer/components/dummies/Notification'
import { Navigation } from '@renderer/components/dummies/Navigation/Navigation'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { ToastContainer } from 'react-toastify'

const RootLayout: React.FC = () => (
  <>
    <Outlet />
    <Navigation />
    <BackNotification />
    <ToastContainer />
    <TanStackRouterDevtools />
  </>
)

export const Route = createRootRoute({ component: RootLayout })
