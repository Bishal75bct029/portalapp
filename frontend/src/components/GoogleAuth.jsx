import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import http from '@/http';
import { useToast } from '../components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '@/providers/Auth';

const GoogleAuth = () => {
    const clientId = '893078638476-914ds77nv7kh3amtip1eq1h0vueu92pm.apps.googleusercontent.com'
    const { toast } = useToast();
    const navigate = useNavigate();
    const { login } = useContext(AuthContext)

    const onSuccess = async (res) => {
        try {
            const response = await http.post('/employer/login', {
                token: res.credential
            });

            if (response.token) {
                toast({
                    title: "Logged in successfully",
                })
            }

            login({
                token: response?.data.token,
                user: response?.data.user,
            })

            navigate('/')
        } catch (e) {
            toast({
                variant: "destructive",
                title: e.response.data.error,
                description: "There was a problem with your request.",
            })
        }
    }

    const onError = () => {
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "There was a problem with your request.",
        })
    }

    return (
        <div className='flex justify-center'>
            <GoogleOAuthProvider clientId={clientId} >
                <GoogleLogin
                    onSuccess={onSuccess}
                    onError={onError}
                />
            </GoogleOAuthProvider>

        </div>
    );
}

export default GoogleAuth;