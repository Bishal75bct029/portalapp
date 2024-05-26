import http from '../http'
import useForm from '../hooks/useForm'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../providers/Auth'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../components/ui/use-toast'
import GoogleAuth from '@/components/GoogleAuth'


export default function LoginPage() {
    const navigate = useNavigate();
    const [googleLogin, setGoogleLogin] = useState(false);
    const { toast } = useToast();
    const { user, login } = useContext(AuthContext)

    useEffect(() => {
        if (user) navigate('/')
    }, [])

    const { data, updateData, loading, setLoading, errors, setErrors } = useForm({
        email: '',
        password: '',
    })

    async function onSubmit(e) {
        e.preventDefault()

        setLoading(true)
        setErrors({})

        try {
            const res = await http.post('login', {
                email: data.email,
                password: data.password,
            })

            login({
                token: res.data.token,
                user: res.data.user,
            })

            toast({
                title: 'Successfully logged in'
            })

            navigate('/')
        } catch (error) {
            if (error.response?.status === 422) {
                return setErrors(error.response.data.errors)
            }
            return setErrors(error?.response?.data.error)

            // @todo: toast
        } finally {
            setLoading(false)
        }
    }

    return (
        <>

            <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Sign in to your account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
                    <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
                        <form className="space-y-6" onSubmit={onSubmit}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                    Email address
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        value={data.email}
                                        onChange={(e) => updateData('email', e.target.value)}
                                    />
                                </div>
                                {errors && (<p className="mt-1 text-sm text-red-500">{errors?.email}</p>)}
                                {typeof errors == 'string' && (<p className="mt-1 text-sm text-red-500">{errors}</p>)}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                    Password
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        value={data.password}
                                        onChange={(e) => updateData('password', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed"
                                    disabled={loading}
                                >
                                    Sign in
                                </button>
                            </div>
                        </form>

                        <div>
                            <div className="relative mt-7">
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    <div className="w-full border-t border-gray-200" />
                                </div>
                                <div className="relative flex justify-center text-sm font-medium leading-6">
                                    <span className="bg-white px-6 text-gray-900">Or continue with</span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <GoogleAuth />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
