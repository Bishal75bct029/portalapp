import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthProvider } from './providers/Auth'
import { RouterProvider } from 'react-router-dom'
import router from './router.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)
