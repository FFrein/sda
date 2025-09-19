import { createFileRoute } from '@tanstack/react-router'
import Home from '@renderer/components/pages/Home/index'

export const Route = createFileRoute('/')({ component: Home })
