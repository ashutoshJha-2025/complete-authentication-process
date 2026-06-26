import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showSuccess, showError } from "../components/ToastMessageBox.jsx";
import axios from 'axios'

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' })
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()

    const sendData = async () => {
        try {
            const result = await axios.post(`http://localhost:3000/api/auth-user/register`, formData, { withCredentials: true })
            showSuccess(result.data.message)
            setTimeout(() => {
                navigate('/')
                setFormData({ username: '', email: '', password: '' })
            }, 1000)
        } catch (error) {
            showError(error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || error.message || 'Invalid credentials')
        }
    }

    return (
        <>
            <div className="w-full h-full flex items-center justify-center sm:px-4">
                <div className="w-100 max-sm:w-75 bg-white rounded-3xl shadow-2xl sm:px-8 max-sm:px-4 py-4">
                    <h1 className="text-center text-3xl font-semibold text-slate-700">Register</h1>

                    <form onSubmit={(e) => e.preventDefault()} className="mt-6 space-y-4">
                        <div className="space-y-2">
                            <div>
                                <label htmlFor="username" className="block text-lg font-medium text-slate-600">
                                    Username
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    type="text"
                                    autoComplete="username"
                                    placeholder="Enter username"
                                    className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-lg text-slate-700 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-lg font-medium text-slate-600">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    autoComplete="email"
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
                                type="checkbox"
                                className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                                onClick={() => setShowPassword(!showPassword)}
                            />
                            <label htmlFor="show-password" className="text-base text-slate-600">
                                Show Password
                            </label>
                        </div>

                        <button
                            onClick={sendData}
                            type="submit"
                            className="w-full hover:rounded-lg bg-sky-600 px-4 py-3 text-lg font-semibold text-white transition duration-150 ease-in hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                        >
                            SIGN UP
                        </button>
                    </form>
                </div>
            </div>

        </>
    )
}

export default Register