const nodeMailer = require('nodemailer');
require('dotenv').config();

const html = (username, token, host) =>`
    <h1>Hello ${username}</h1>
    
    <p>Click below to reset your password.</p>
    
    <a href="http://${host}/auth/reset-password/${token}">Reset Password</a>
    
    <p>If you did not request a password reset, please ignore this email.</p>
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

    
    info: async(req, res, username, token, email) => {
        try {
            await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: email,
        subject: 'Reset Password',
        html: html(username, token, req.headers.host)
    })} catch (error) {
        console.error('Error Sending reset password email: ', error);
        throw error;
        }
    }
};