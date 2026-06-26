import Redis from 'ioredis'
import crypto from 'crypto';
import { User } from '../models/user.model.js';

const redis = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT || 6379),
});

const checkRedisConnection = async () => {
    try {
        await redis.connect();
        const response = await redis.ping();
        console.log(`[Redis] running: ${response === 'PONG'}`);
        return response === 'PONG';
    } catch (error) {
        console.error('[Redis] not running:', error?.message || error);
        return false;
    }
};

const storeOtp = async (userId, otp) => {
    if (redis.status !== 'ready') {
        await redis.connect();
    }
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
    await redis.set(`verify:${userId}`, otpHash, 'EX', 300);
    return otpHash;
};

const verifyOtp = async (userId, otp) => {
    if (!userId || !otp) {
        return {
            success: false,
            message: 'User id and OTP are required'
        };
    }

    const incomingHashOtp = crypto
        .createHash('sha256')
        .update(otp.toString())
        .digest('hex');

    const savedHashOtp = await redis.get(`verify:${userId}`);

    if (!savedHashOtp) {
        return {
            success: false,
            message: 'OTP expired'
        };
    }

    if (savedHashOtp !== incomingHashOtp) {
        return {
            success: false,
            message: 'Invalid OTP'
        };
    }

    await User.findByIdAndUpdate(userId, { isVerified: true });
    await redis.del(`verify:${userId}`);

    return {
        success: true,
        message: 'Email verified successfully'
    };
};

export { checkRedisConnection, storeOtp, verifyOtp }