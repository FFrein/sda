import { createFileRoute } from '@tanstack/react-router'

function Home(): React.JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <>
      <div className="action">
        <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
          Send IPC
        </a>
      </div>
    </>
  )
}

export const Route = createFileRoute('/')({ component: Home })
