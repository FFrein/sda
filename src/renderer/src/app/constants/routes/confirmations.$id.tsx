import { createFileRoute } from '@tanstack/react-router'

const RouteComponent: React.FC = () => {
  const { id } = Route.useParams()
  return <div>{id} Hello "/confirmations"!</div>
}

export const Route = createFileRoute('/confirmations/$id')({
  component: RouteComponent
})
