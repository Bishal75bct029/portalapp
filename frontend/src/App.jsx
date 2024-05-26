import { useContext } from 'react'
import { AuthContext } from './providers/Auth'
import { Outlet } from 'react-router-dom'
import { Toaster } from './components/ui/toaster'

function App() {
  const { loading } = useContext(AuthContext)

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      {loading ? <></> : <Outlet />}
    </div>
  )
}

export default App
