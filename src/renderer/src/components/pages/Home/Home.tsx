import { AccountsList } from '@renderer/components/widgets/Accounts/List/index'

const Home: React.FC = () => {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <div>
      <AccountsList />
      <div className="action">
        src/renderer/src/components/pages/Home/components/Accounts
        src/renderer/src/components/pages/Home/components/toolbar
        <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
          Send IPC
        </a>
      </div>
    </div>
  )
}

export default Home
