

import { createFileRoute } from '@tanstack/react-router'

const Settings = () => {
  return <div>About</div>
}

export const Route = createFileRoute('/settings')({ component: Settings })