import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { showSuccess, showError } from "../components/ToastMessageBox.jsx";

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()

    const sendData = async () => {
        try {
            const result = await axios.post(`http://localhost:3000/api/auth-user/login`, formData, { withCredentials: true })
            showSuccess(result.data.message)
            setTimeout(() => {
                navigate('/')
                setFormData({ email: '', password: '' })
            }, 1000)
        } catch (error) {
            showError(error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || error.message || 'Invalid credentials')
        }
    }

    return (
        <div id='login-page' className="w-full h-[88%] flex items-center justify-center sm:px-4">
            <div className="w-100 max-sm:w-75 bg-white rounded-3xl shadow-2xl sm:px-8 max-sm:px-4 py-4 ">
                <h1 className="text-center text-3xl font-semibold text-slate-700">Login</h1>

                <form onSubmit={(e) => e.preventDefault()} className="mt-6 space-y-4">
                    <div className="space-y-2">
                        <div>
                            <label htmlFor="email" className="block text-lg font-medium text-slate-600">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="Enter email"
                                className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-lg text-slate-700 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-lg font-medium text-slate-600">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="current-password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="Enter password"
                                className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-lg text-slate-700 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            id="show-password"
                            name="showPassword"
                            onClick={() => setShowPassword(!showPassword)}
                            type="checkbox"
                            className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                        />
                        <label htmlFor="show-password" className="text-base text-slate-600">
                            Show Password
                        </label>
                    </div>

                    <button
                        type="submit"
                        onClick={sendData}
                        className="w-full hover:rounded-lg bg-sky-600 px-4 py-3 text-lg font-semibold text-white transition duration-150 ease-in hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                    >
                        SIGN IN
                    </button>

                    <div className="flex items-center gap-3 ">
                        <p>Don't have an account? <button onClick={() => navigate('/register')} className='text-sky-600 font-semibold cursor-pointer '>Register</button></p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login