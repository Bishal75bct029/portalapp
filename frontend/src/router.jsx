import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import LoginPage from './pages/Login'
import { HomePage } from './pages/Home'

export default createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <HomePage />,
            },
            {
                path: "/login",
                element: <LoginPage />
            },
        ]
    }
])