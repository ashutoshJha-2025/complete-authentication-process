import axios from 'axios'
import { showError, showSuccess } from '../components/ToastMessageBox.jsx'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

const Profile = () => {
    const navigate = useNavigate()
    const [Otp, setOtp] = useState("");
    const [data, setData] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const date = data?.updatedAt ? new Date(data.updatedAt).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }) : '';

    const getDisplayName = (name) => {
        if (!name) return ''
        return name
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ')
    }

    const getInitials = (name) => {
        if (!name) return 'U'
        return name.slice(0, 2).toUpperCase()
    }

    async function getMe() {
        try {
            const response = await axios.get(`http://localhost:3000/api/auth-user/get-me`, { withCredentials: true })
            setData(response?.data?.findUser)
            showSuccess('Profile Fetched Successfully')
        } catch (error) {
            showError(error.response?.data?.message || error.response?.data?.errors[0]?.msg || error.message || 'Invalid credentials')
        }
    }

    useEffect(() => {
        getMe()
    }, [])

    const handleCardOtpChange = (e) => {
        const val = e.target.value.replace(/\D/g, "").slice(0, 6);
        setOtp(val);
    };

    const handleSendOtp = async () => {
        setIsLoading(true)
        try {
            const response = await axios.post('http://localhost:3000/api/auth-user/send-otp', {}, { withCredentials: true })
            showSuccess(response?.data?.message || 'OTP sent successfully')
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Unable to send OTP'
            showError(message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleVerifyOtp = async () => {
        if (!Otp.trim()) {
            showError('Please enter the OTP')
            return
        }

        setIsLoading(true)
        try {
            const response = await axios.post('http://localhost:3000/api/auth-user/verify-otp', { otp: Otp }, { withCredentials: true })
            showSuccess(response?.data?.message || 'Email verified successfully')
            setOtp('')
            setData((prev) => prev ? { ...prev, isVerified: true } : prev)
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Unable to verify OTP'
            showError(message)
        } finally {
            setIsLoading(false)
        }
    }

    async function logout() {
        try {
            const response = await axios.post(`http://localhost:3000/api/auth-user/logout`, {}, { withCredentials: true })
            showSuccess('Logged out successfully')
            navigate('/')
        } catch (error) {
            showError(error.response?.data?.message || error.response?.data?.errors[0]?.msg || error.message || 'Unauthorized user, login / register to continue !')
        }
    }

    return (
        <div id="profile-page" className="w-full min-h-screen flex flex-col items-center">

            <div className="max-sm:flex-col max-sm:gap-2 w-full sticky top-0 z-30 backdrop-blur-md bg-[#1A1A19] border-b border-[#313130] px-6 md:px-12 py-3.5 shadow-sm flex items-center justify-between">
                <span className="text-gray-500 font-semibold text-md tracking-tight">Profile updated at : {date}</span>

                <div className="flex items-center min-[340px]:gap-2.5 ">
                    <button onClick={() => navigate('/log-in')} className="px-4 py-2 cursor-pointer rounded-lg text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 transition-colors">Login</button>
                    <button onClick={() => logout()} className="px-4 py-2 cursor-pointer rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 transition-colors">Logout</button>
                </div>
            </div>

            <main className="w-120 mx-auto px-6 pt-8">
                <div className="flex items-center gap-5 mb-8">
                    <div className="w-14 h-14 rounded-full bg-[#032042] border border-blue-800 flex items-center justify-center text-xl font-medium text-[#6CA7EC] shrink-0 select-none">
                        {getInitials(data?.username)}
                    </div>
                    <div>
                        <h1 className="text-2xl font-medium text-white leading-tight">
                            {getDisplayName(data?.username) || null}
                        </h1>
                        <p className="text-sm text-gray-500 font-medium mt-0.5">Personal account</p>
                    </div>
                </div>

                <p className="text-[11px] font-medium uppercase tracking-[0.07em] text-gray-500 mb-2">
                    Account details
                </p>

                <div className="w-full bg-[#1A1A19] text-white border border-[#313130] rounded-xl overflow-hidden mb-5">

                    <div className="flex items-center justify-between px-4 py-3 border-b border-[#313130] ">
                        <div className="flex items-center gap-2.5">
                            {/* user icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400" aria-hidden="true">
                                <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                            </svg>
                            <span className="text-sm text-gray-200 ">Username</span>
                        </div>
                        <span className="text-sm font-medium">{getDisplayName(data?.username) || null}</span>
                    </div>

                    <div className="flex items-center justify-between px-4 py-3 border-b  border-[#313130] ">
                        <div className="flex items-center gap-2.5">
                            {/* mail icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400" aria-hidden="true">
                                <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                            </svg>
                            <span className="text-sm text-gray-200">Email</span>
                        </div>
                        <span className="text-sm font-medium">{data?.email}</span>
                    </div>

                    <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-2.5">
                            {/* shield-check icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400" aria-hidden="true">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" />
                            </svg>
                            <span className="text-sm text-gray-200">Verification</span>
                        </div>
                        {data?.isVerified ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#003102] text-[#00d034] border border-[#004f07]">
                                {/* check circle */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" />
                                </svg>
                                Verified
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#311A00] text-[#D06200] border border-[#4F2E00]">
                                {/* clock */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                                </svg>
                                Pending
                            </span>
                        )}
                    </div>
                </div>

                {data?.isVerified === false ? (
                    <div className="bg-[#1A1A19] border border-[#512E00] rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                            {/* mail-forward icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500" aria-hidden="true">
                                <polyline points="22 8 22 2 16 2" /><line x1="22" x2="12" y1="2" y2="12" /><path d="M4 20c0-4 3.6-7 8-7 1.4 0 2.7.3 3.9.9" />
                            </svg>
                            <span className="text-sm font-medium text-white">Verify your email</span>
                        </div>
                        <p className="text-xs text-gray-400 mb-3 leading-relaxed">
                            A 6-digit code was sent to your email address. Enter it below to activate your account.
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="000000"
                                maxLength={6}
                                value={Otp}
                                onChange={handleCardOtpChange}
                                className="flex-1 h-9 px-3 text-sm font-mono tracking-widest text-gray-200 bg-[#2C2C2A] border border-[#41413F] rounded-lg outline-none focus:border-gray-600 placeholder:font-sans placeholder:tracking-normal placeholder:text-gray-400"
                            />
                            <button
                                onClick={handleSendOtp}
                                disabled={isLoading}
                                className="h-9 px-4 text-xs font-medium text-white bg-yellow-500 rounded-lg cursor-pointer hover:bg-yellow-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Please wait' : 'Get OTP'}
                            </button>
                            <button
                                onClick={handleVerifyOtp}
                                disabled={isLoading}
                                className="h-9 px-4 text-xs font-medium text-white bg-blue-500 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Checking' : 'Verify'}
                            </button>
                        </div>
                    </div>
                ) : ''}

            </main>

        </div >
    )
}

export default Profile