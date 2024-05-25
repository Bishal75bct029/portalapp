import { useState, useContext, createContext, useEffect } from 'react'
import LoginPage from './pages/Login'
import useAuth from './hooks/useAuth'
import { AuthContext, AuthProvider } from './providers/Auth'

function App() {
  const { user } = useContext(AuthContext)

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        {!user && <LoginPage />}
        {user && (<div>Hello {user.name}</div>)}
      </div>
    </AuthProvider >
  )
}

export default App
