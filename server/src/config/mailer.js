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

const contactUsHtml = (username, message) =>`
<h1>From ${username}</h1>

<p>${message}</p>

`;

const welcomeHtml = (username) =>
`
<h1>Hello ${username},</h1>

<p>Your account has been successfully created.</p>

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
    },

    contactInfo: async(req, res, username, message, email) => {
        try {
            await transporter.sendMail({
        from: email,
        to: process.env.CONTACT_MAIL,
        subject: `Contact Us`,
        html: contactUsHtml(username, message)
    })
        console.log(`Email from ${email} to ${process.env.CONTACT_MAIL}!`);
        } catch (error) {
        console.error('Error Sending reset password email: ', error);
        throw error;
        }
    },

    welcomeInfo: async(req, res, username, email) => {
        try {
            await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: email,
        subject: `Welcome ${username}! `,
        html: welcomeHtml(username)
    })
        console.log(`Email Sent to ${email}!`);
        } catch (error) {
        console.error('Error Sending reset password email: ', error);
        throw error;
        }
    },

    statusinfo: async(req, res, username, email, status) => {
        try {   
            await transporter.sendMail({
                  from: process.env.MAIL_USER,
                  to: email,
                  subject: 'Appointment Status Updated',
                  html: `<h1>Hello ${username},</h1><p>Your appointment status has been updated to: <strong>${status}</strong>.</p>`,
                })
                console.log(`Email Sent to ${email}!`);
            } catch (error) {
            console.error('Error Sending reset password email: ', error);
            throw error;
            }
        },

    appointmentInfo: async(req, res, username, email, date, timeSlot, patientName) => {
        try {   
            // Send email notification to doctor
          await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: 'New Pending Appointment',
            html: `
              <h1>New Appointment Request</h1>
              <p>Dear ${username},</p>
              <p>You have a new pending appointment:</p>
              <ul>
                <li><strong>Date:</strong> ${date}</li>
                <li><strong>Time Slot:</strong> ${timeSlot}</li>
                <li><strong>Patient:</strong> ${patientName}</li>
              </ul>
              <p>Please review and confirm the appointment in your dashboard.</p>
            `,
          })
                console.log(`Email Sent to ${email}!`);
            } catch (error) {
            console.error('Error Sending reset password email: ', error);
            throw error;
            }
        },

    medicalRecordInfo: async(req, res, username, email) => {
        try {   
            await transporter.sendMail({
                from: process.env.MAIL_USER,
                to: email,
                subject: "New Health Record Created",
                html: `<h1>Hello ${username},</h1><p>A new health record has been created for you. Please log in to view the details.</p>`,
              });
                console.log(`Email Sent to ${email}!`);
            } catch (error) {
            console.error('Error Sending reset password email: ', error);
            throw error;
            }
        },

        blogInfo: async(req, res, title, recipientEmails) => {
            try {   
                await transporter.sendMail({
                    from: process.env.MAIL_USER,
                    to: recipientEmails.join(","), // Join multiple emails into a single string
                    subject: 'New Blog Published',
                    html: `<h1>${title}</h1>
                           <p>Check out the blog now!</p>`,
                });
                console.log(`Emails sent to: ${recipientEmails.join(",")}`);
            } catch (error) {
                console.error('Error sending blog notification emails: ', error);
                res.status(500).json({ error: "Failed to send email notifications." });
                throw error;
            }
        },

};