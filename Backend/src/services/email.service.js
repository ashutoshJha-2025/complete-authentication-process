import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_USER,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
    },
});

const checkEmailConnection = async () => {
    try {
        await transporter.verify();
        console.log('[Nodemailer] server is running and ready to send messages');
        return true;
    } catch (error) {
        console.error('[Nodemailer] server is not reachable:', error?.message || error);
        return false;
    }
};

const sendEmail = async ({ to, subject, html, text }) => {
    try {
        await transporter.sendMail({
            from: `"SecureBank" <${process.env.GMAIL_USER}>`,
            to,
            subject,
            text,
            html,
        });
        console.log(`Email sent successfully to ${to}`);
    } catch (error) {
        console.error(`Failed to send email to ${to}\n:`, error?.stack || error);
        throw error;
    }
};

async function sendWelcomeEmail(userEmail, name, otp) {
    const subject = 'Welcome to SecureBank';

    const text = `
        Dear ${name},

        Welcome to SecureBank.

        Your One-Time Password (OTP) for email verification is:
        ${otp}

        This OTP is valid for 5 minutes.

        If you did not request this verification, please ignore this email or contact our support team immediately.

        For your security:
        - Never share this OTP with anyone.
        - This OTP can only be used once.

        Regards,
        SecureBank Team
    `;

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
            <h2>SecureBank Email Verification</h2>

            <p>Dear <strong>${name}</strong>,</p>

            <p>Thank you for registering with SecureBank.</p>

            <p>Please use the following One-Time Password (OTP) to verify your email address:</p>

            <div style="
                background: #f5f5f5;
                border: 1px solid #ddd;
                border-radius: 8px;
                padding: 20px;
                text-align: center;
                margin: 20px 0;
            ">
                <span style="
                    font-size: 32px;
                    font-weight: bold;
                    letter-spacing: 8px;
                ">
                    ${otp}
                </span>
            </div>

            <p>
                <strong>Validity:</strong> This OTP will expire in
                <strong>5 minutes</strong>.
            </p>

            <div style="
                background: #fff8e1;
                border-left: 4px solid #ffc107;
                padding: 12px;
                margin-top: 20px;
            ">
                <strong>Security Reminder</strong>
                <ul>
                    <li>Never share your OTP with anyone.</li>
                    <li>SecureBank will never ask for your OTP.</li>
                    <li>If you did not request this verification, ignore this email and contact support.</li>
                </ul>
            </div>

            <p>
                Regards,<br />
                <strong>SecureBank Team</strong>
            </p>
        </div>
    `;

    await sendEmail({
        to: userEmail,
        subject,
        text,
        html,
    });
}

async function sendLoginAlertEmail(userEmail, name, ipAddress, device, loginTime) {
    const subject = 'Security Alert: New Login Detected';

    const text = `
        Dear ${name},

        A login to your SecureBank account was detected.

        Time: ${loginTime}
        IP Address: ${ipAddress}
        Device: ${device}

        If this was you, no action is required.

        If you do not recognize this activity, immediately change your password and contact support.

        SecureBank Security Team
    `;

    const html = `
    <div style="font-family: Arial, sans-serif; max-width:600px;">
        <h2>Security Alert</h2>

        <p>Hello <strong>${name}</strong>,</p>

        <p>A login to your SecureBank account was detected.</p>

        <table style="border-collapse: collapse;">
            <tr>
                <td><strong>Time:</strong></td>
                <td>${loginTime}</td>
            </tr>
            <tr>
                <td><strong>IP Address:</strong></td>
                <td>${ipAddress}</td>
            </tr>
            <tr>
                <td><strong>Device:</strong></td>
                <td>${device}</td>
            </tr>
        </table>

        <br>

        <div style="background:#fff3cd;padding:15px;border-radius:8px;">
            <strong>Didn't log in?</strong><br>
            Change your password immediately and contact support.
        </div>

        <p>
            Regards,<br>
            SecureBank Security Team
        </p>
    </div>
    `;

    await sendEmail({
        to: userEmail,
        subject,
        text,
        html,
    });
}

async function sendLogoutAlertEmail(userEmail, name, logoutTime) {
    const subject = 'Security Alert: Logout Detected';

    const text = `
        Dear ${name},

        A logout from your SecureBank account was detected.

        Time: ${logoutTime}

        If this was not you, please change your password immediately.

        SecureBank Security Team
    `;

    const html = `
    <div style="font-family: Arial, sans-serif; max-width:600px;">
        <h2>Security Alert</h2>

        <p>Hello <strong>${name}</strong>,</p>

        <p>A logout from your SecureBank account was detected.</p>

        <p><strong>Time:</strong> ${logoutTime}</p>

        <div style="background:#fff3cd;padding:15px;border-radius:8px;">
            <strong>Didn't log out?</strong><br>
            Change your password immediately and contact support.
        </div>

        <p>
            Regards,<br>
            SecureBank Security Team
        </p>
    </div>
    `;

    await sendEmail({
        to: userEmail,
        subject,
        text,
        html,
    });
}

export { sendWelcomeEmail, sendLoginAlertEmail, sendLogoutAlertEmail, checkEmailConnection }