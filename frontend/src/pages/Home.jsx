import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../providers/Auth";
import http from "../http";
import Admin from "../components/Admin";
import Employer from "../components/Employer";
import Employee from "../components/Employee";
import { toast } from "../components/ui/use-toast";
import { useToast } from '../components/ui/use-toast';

export function HomePage() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { user, setUser, logout } = useContext(AuthContext);
    const token = localStorage.getItem('token');

    useEffect(() => {

        if (!token) return navigate('/login')

        async function validateToken() {
            try {
                const response = await http.get('/me');
                setUser(response.data);
            }
            catch (e) {
            }
        }
        validateToken()
    }, []);

    const userLogout = () => {
        logout();
        navigate('/login');
    }
    
    return (
        <>
            <div className="flex justify-between">
                <p className="text-lg hover:underline ml-24 mt-5 mb-4">Welcome {user?.name}</p>
                <button onClick={userLogout} className="mr-20 mb-0">Logout</button>
            </div>
            {
                user?.role === 'admin' ? <Admin /> :
                    user?.role === 'employer' ? <Employer /> :
                        user?.role === 'employee' ? <Employee /> : ''
            }
        </>
    );
}
