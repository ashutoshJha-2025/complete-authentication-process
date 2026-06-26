import { Router } from 'express'
import { registerUser, loginUser, logoutUser, getMe } from '../controller/auth.controller.js'
import { sendOtp, verifyOtpController } from '../controller/otp.controller.js'
import { registeredUserValidationRules, loginUserValidationRules, verifyJwt } from '../middleware/auth.middleware.js'

const authRoutes = Router()
authRoutes.post('/register', registeredUserValidationRules, registerUser)
authRoutes.post('/login', loginUserValidationRules, loginUser)
authRoutes.post('/logout', verifyJwt, logoutUser)
authRoutes.post('/send-otp', verifyJwt, sendOtp)
authRoutes.post('/verify-otp', verifyJwt, verifyOtpController)
authRoutes.get('/get-me', verifyJwt, getMe)

export { authRoutes }