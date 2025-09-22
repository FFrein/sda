import { createFileRoute } from '@tanstack/react-router'
import Confirmations from '@renderer/components/pages/Confirmations/index'

export const Route = createFileRoute('/confirmations/$id')({
  component: Confirmations
})
