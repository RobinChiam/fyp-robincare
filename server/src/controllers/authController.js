const User = require('../models/user-model');
const Patient = require('../models/patient-model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const loginHandler = async (req, res) => {
    const { identifier, password } = req.body; // Identifier is IC/Passport Number or Email

    try {
        // Find the user by IC/Passport Number or Email
        const user = await User.findOne({ $or: [{ email: identifier }, { icNumber: identifier }] });
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        // Generate a JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Respond with the token
        res.status(200).json({ token, role: user.role });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};



const registerHandler = async (req, res) => {
    const { email, pin } = req.body;
  
    try {
      const verification = await Verification.findOne({ email, pin });
  
      if (!verification) {
        return res.status(400).json({ message: 'Invalid PIN.' });
      }
  
      // Create user in User collection
      await User.create({
        icOrPassport: verification.icOrPassport,
        fullName: verification.fullName,
        email: verification.email,
        dob: verification.dob,
        password: verification.password, // Hash password in production
      });
  
      // Delete verification record
      await Verification.deleteOne({ email });
  
      res.status(200).json({ message: 'Account created successfully!' });
    } catch (err) {
      res.status(500).json({ message: 'Verification failed.', error: err.message });
    }
  };



const forgetPasswordHandler = async (req, res) => {

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
        
    // Set token and expiration on user document
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiration
    await user.save();
    await info(req, res, user.username, resetToken, user.email);
        console.log("Email Sent!");
    }catch (error) {
        console.error(error);
        res.render('forgot-password', { errorMessage: 'An error occurred. Please try again.' });
    }

};

const resetPasswordHandler = async (req, res) => {

    /* === Reset Password === */
    const { password, confirmPassword } = req.body;

    try {
        // Find the user by reset token
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (password !== confirmPassword) {
        console.log(`Passwords do not match`);
        return res.render('reset-password', { errorMessage: 'Passwords do not match.' });
        }

      if (!user) {
        console.log(`Invalid Password Reset Token`);
        return res.render('forgot-password', { errorMessage: 'Password reset token is invalid or has expired.' });
      }

    // Update the password
    user.password = password; 
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    console.log(`Password has been reset to ${password}`);
    } catch (error) {
    console.error(error);
    res.render('reset-password', { errorMessage: 'An error occurred. Please try again.', token: req.params.token });
    }
};


module.exports = { loginHandler, registerHandler, forgetPasswordHandler, resetPasswordHandler };
