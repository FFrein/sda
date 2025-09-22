import { Navigation } from '@renderer/components/dummies/Navigation/Navigation'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

const RootLayout: React.FC = () => (
  <>
    <Outlet />
    <Navigation />
    <TanStackRouterDevtools />
  </>
)

export const Route = createRootRoute({ component: RootLayout })
