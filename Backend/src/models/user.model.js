import mongoose, { modelNames, mongo } from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        index: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
        select: false,
    },
    refreshToken: {
        type: String,
        default: null,
        required: false,
        trim: true,
        select: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true })

userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return
    }
    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateRefreshToken = async function () {
    const refreshToken = jwt.sign(
        {
            id: this._id,
            username: this.username,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    )
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10)
    this.refreshToken = hashedRefreshToken
    await this.save({ validateBeforeSave: false })

    return refreshToken
}

userSchema.methods.generateAccessToken = async function () {
    const accessToken = jwt.sign(
        { id: this._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    )
    return accessToken
}

userSchema.methods.isRefreshTokenCorrect = async function (token) {
    return await bcrypt.compare(token, this.refreshToken)
}

const User = mongoose.model('User', userSchema)
export { User }