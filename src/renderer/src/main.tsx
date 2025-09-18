import './assets/main.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Import the generated route tree
import { routeTree } from '../../routeTree.gen.ts'
import { createRouter, RouterProvider } from '@tanstack/react-router'

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)

//https://tanstack.com/router/latest/docs/framework/react/quick-start