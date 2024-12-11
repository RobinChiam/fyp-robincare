const nodeMailer = require('nodemailer');
require('dotenv').config();

const resetPasswordHtml = (username, token, host) =>`
    <h1>Hello ${username}</h1>
    
    <p>Click below to reset your password.</p>
    
    <a href="http://localhost:5173/reset-password/${token}">Reset Password</a>
    
    <p>If you did not request a password reset, please ignore this email.</p>
    `;

const verifyPINHtml = (username, pin) =>`
<h1>Hello ${username}</h1>

<p>Please verify your Email Account before we can create your account.</p>

${pin}

<p>If you did not create an account with us, please ignore this email.</p>
`;

   const transporter = nodeMailer.createTransport({
        host: 'tactigon.mschosting.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD
            }
        });

module.exports = {

    
    resetPasswordInfo: async(req, res, username, token, email) => {
        try {
            await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: email,
        subject: 'Reset Password',
        html: resetPasswordHtml(username, token, req.headers.host)
    })
        console.log(`Email Sent to ${email}!`);
        } catch (error) {
        console.error('Error Sending reset password email: ', error);
        throw error;
        }
    },
    verifyPINInfo: async(req, res, name, pin, email) => {
        try {
            await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: email,
        subject: `Verify PIN for ${name}`,
        html: verifyPINHtml(name, pin)
    })
        console.log(`Email Sent to ${email}!`);
        } catch (error) {
        console.error('Error Sending reset password email: ', error);
        throw error;
        }
    }

};