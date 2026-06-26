import { sendWelcomeEmail } from '../services/email.service.js';
import { storeOtp, verifyOtp } from '../services/redis.service.js';

async function sendOtp(req, res) {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized request' });
    }

    if (user.isVerified) {
        return res.status(400).json({ message: 'Email is already verified' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await storeOtp(user._id.toString(), otp);

    try {
        await sendWelcomeEmail(user.email, user.username, otp);
        return res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('[Mail] failed to send verification email:', error?.message || error);
        return res.status(500).json({ message: 'Failed to send OTP. Please try again later.' });
    }
}

async function verifyOtpController(req, res) {
    const user = req.user;
    const { otp } = req.body;

    if (!user) {
        return res.status(401).json({ message: 'Unauthorized request' });
    }

    if (!otp) {
        return res.status(400).json({ message: 'OTP is required' });
    }

    if (user.isVerified) {
        return res.status(200).json({ message: 'Email already verified' });
    }

    const result = await verifyOtp(user._id.toString(), otp);

    if (!result.success) {
        return res.status(400).json({ message: result.message });
    }

    return res.status(200).json({ message: result.message });
}

export { sendOtp, verifyOtpController }