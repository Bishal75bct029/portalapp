import { createContext } from 'react'
import { useState, useContext, useEffect } from 'react'
import http from '../http';

export const AuthContext = createContext()

export function AuthProvider(props) {
    const [user, setUser] = useState(null);

    const fetchUser = () => {
        if (!localStorage.getItem('token')) {
            logout();
        }

        http.get('/me')
            .then(response => setUser(response.data))
            .catch((err) => {
                if (err.response.status === 401) {
                    logout();
                }

                // @todo: toast error
            });
    }

    useEffect(fetchUser, [setUser])

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
    }

    const login = ({ user, token }) => {
        localStorage.setItem('token', token);
        console.log(user)
    }
    
    return (
        <AuthContext.Provider value={{ user, setUser, login, logout, fetchUser }}>
            {props.children}
        </AuthContext.Provider>
    )
}