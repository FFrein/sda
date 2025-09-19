import { createFileRoute } from '@tanstack/react-router'
import Settings from '@renderer/components/pages/Settings/index'

export const Route = createFileRoute('/settings')({
  component: Settings
})
