import { User } from "../models/user.model.js";
import { checkRedisConnection, storeOtp } from "../services/redis.service.js";
import { sendWelcomeEmail, sendLoginAlertEmail, sendLogoutAlertEmail } from '../services/email.service.js'

async function registerUser(req, res) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            message: 'Username, email and password are required'
        });
    }

    const isUserAlreadyExists = await User.findOne({
        $or: [
            { username },
            { email }
        ]
    });

    if (isUserAlreadyExists) {
        return res.status(409).json({
            message: 'User with the same username or email already exists'
        });
    }

    const user = await User.create({ username, email, password });
    const refreshToken = await user.generateRefreshToken()
    const accessToken = await user.generateAccessToken()

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await storeOtp(user._id.toString(), otp);

    try {
        await sendWelcomeEmail(user.email, user.username, otp);
    } catch (error) {
        console.error(error)
    }

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 15 * 24 * 60 * 60 * 1000
    });

    return res.status(201).json({
        message: 'User registered successfully. Verify your email using the OTP sent to your inbox.',
        userId: user,
        accessToken
    });
}

async function loginUser(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: 'Email and password are required'
        });
    }

    const user = await User.findOne({ email }).select('+password +refreshToken');

    if (!user) {
        return res.status(404).json({
            message: 'User not found'
        });
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        return res.status(401).json({
            message: 'Invalid credentials'
        });
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * 24 * 60 * 60 * 1000,
    };

    res.cookie('refreshToken', refreshToken, cookieOptions);
    res.setHeader('x-access-token', accessToken);

    try {
        await sendLoginAlertEmail(
            user.email,
            user.username,
            req.ip || 'unknown',
            req.get('user-agent') || 'unknown',
            new Date().toLocaleString()
        );
    } catch (error) {
        console.error('[Mail] failed to send login alert:', error?.message || error);
    }

    return res.status(200).json({
        message: 'User logged in successfully',
        accessToken,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            isVerified: user.isVerified,
        },
    });
}

async function logoutUser(req, res) {
    const user = req.user;

    if (user) {
        user.refreshToken = null;
        await user.save({ validateBeforeSave: false });
    }

    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    });

    try {
        await sendLogoutAlertEmail(
            user.email,
            user.username,
            new Date().toLocaleString()
        );
    } catch (error) {
        console.error('[Mail] failed to send logout alert:', error?.message || error);
    }

    return res.status(200).json({
        message: 'Logged out successfully'
    });
}

async function getMe(req, res) {
    const userId = req.user?._id
    const findUser = await User.findByIdAndUpdate(userId).select('-password -refreshToken')

    if (!findUser) {
        return res.status(404).json({
            message: 'User not found'
        })
    }
    return res.status(200).json({
        message: 'User info retrieved successfully',
        findUser
    })
}

export { loginUser, registerUser, logoutUser, getMe }