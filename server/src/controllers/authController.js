const User = require('../models/user-model');
const Verification = require('../models/verification-model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const {resetPasswordInfo} = require('../config/mailer');
const Patient = require('../models/patient-model');

const loginHandler = async (req, res) => {
    const { identifier, password } = req.body; // Identifier is IC/Passport Number or Email

    try {
        // Find the user by IC/Passport Number or Email
        const user = await User.findOne({ $or: [{ email: identifier }, { icNumber: identifier }] });
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Compare passwords
        const isMatch = await user.comparePassword(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

       // If authentication is successful, create a session and redirect to dashboard
       req.session.user = user; // Assuming you're using session-based authentication
       req.session.isAuthenticated = true;

        // Respond with the token
         console.log('Login successful! ' + `Welcome ${user.name}`);
        res.status(200).json({ user: req.session.user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};



const registerHandler = async (req, res) => {
  const { email, pin } = req.body;

  console.log(`Received PIN: ${pin}`);
  try {
    const verification = await Verification.findOne({ email, pin });

    if (!verification) {
      return res.status(400).json({ message: 'Invalid PIN or email.' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    // Create user in User collection
    await User.create({
      icNumber: verification.icOrPassport,
      name: verification.fullName,
      email: verification.email,
      role: 'patient',
      dob: verification.dob,
      phone: verification.phoneNumber,
      gender: verification.gender,
      password: verification.password,
    });

    // Delete verification record
    await Verification.deleteOne({ email });

    console.log('Account created successfully!');
    res.status(200).json({ message: 'Account created successfully!' });
  } catch (err) {
    console.error('Error during PIN verification:', err);
    res.status(500).json({ message: 'Verification failed.', error: err.message });
  }
};





const forgetPasswordHandler = async (req, res) => {

  console.log("forgetPasswordHandler Initiated");
  console.log(`Email Address: ${req.body.email}`);
    /* === Forgot Password === */
    const {email} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user){
            console.log("Incorrect Email Address");
            return res.render('forgot-password', { errorMessage: 'No account with that email found.' });
        }

    //Generate a reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    console.log(`Token Generated: ${resetToken}`);
    // Set token and expiration on user document
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 1000 * 60 * 60; // 1 hour expiration
    await user.save();
    console.log(`User Updated: ${user.name}`);
    await resetPasswordInfo(req, res, user.name, resetToken, user.email);
        console.log("Email Sent!");
        res.status(200).json({ message: 'Password reset email sent.' });
      } catch (error) {
        res.status(500).json({ message: 'An error occurred.' });
      }

};

const resetPasswordHandler = async (req, res) => {

  const { token } = req.params;
  const { password } = req.body;

  console.log('resetPasswordHandler Initiated');
  console.log(`Token: ${token}`);
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ message: 'Invalid or expired token.' });

    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred.' });
  }
};

const logoutHandler = (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Logout failed' });
      }
      res.status(200).json({ message: 'Logout successful' });
    }); 
  };


module.exports = { loginHandler, registerHandler, forgetPasswordHandler, resetPasswordHandler, logoutHandler};
