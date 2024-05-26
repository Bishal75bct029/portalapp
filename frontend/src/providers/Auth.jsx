import { createContext, nex } from 'react'
import { useState, useContext, useEffect } from 'react'
import http from '../http';

export const AuthContext = createContext({
    loading: false,
    user: null,
    setUser: (user) => { },
    login: ({ user, token }) => { },
    logout: () => { },
})

export function AuthProvider(props) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    const fetchUser = () => {
        if (!localStorage.getItem('token')) {
            logout();
        }

        setLoading(true);

        http.get('/me')
            .then(response => {
                setUser(response.data)
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    logout();
                }

                // @todo: toast error
            }).finally(() => {
                setLoading(false)
            })
    }

    const login = ({ user, token }) => {
        localStorage.setItem('token', token);
        setUser(user)
    }

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
    }

    useEffect(fetchUser, [])

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout, fetchUser, loading }}>
            {props.children}
        </AuthContext.Provider>
    )
}