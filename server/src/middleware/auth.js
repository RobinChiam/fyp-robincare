const User = require('../models/user-model');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { info } = require('../config/mailer');

module.exports = {
    ensureAuthenticated: (req, res, next) => {

      // console.log(`Session User:`);
      // console.log(req.session);

      if (req.session.user || req.session.isAuthenticated) {
        return next();
      }
      console.log(`Redirected: ${res.statusCode}`);
    //console.log(`User is not Authenticated!`);
      res.redirect('/auth/login');
    },
    isAdmin: (req, res, next) => {
      if (req.session.user && req.session.user.role === 'admin') {
          return next();
      } else {
          return res.redirect('/dashboard'); // Redirect non-admin users to the dashboard
      }
    },

    checkAuthenticated: (req, res, next) => {
      if (req.session.user) {
          return res.redirect('/dashboard'); // Redirect to dashboard if logged in
      }
      next(); // Proceed to the login page if not logged in
  },

//   /* ===== GET Requests ===== */

// // Registration page
// router.get('/register', checkAuthenticated, (req, res) => {
//   res.render('register');
// });

// // Login page
// router.get('/login', checkAuthenticated, (req, res) => {
//   res.render('login');
//   console.log(`Status Code: ${res.statusCode}`);
// });

/* ===== POST Requests ===== */

 /* === Register routes === */
register : async (req, res, next) => {
  const { username, email, password, confirmPassword } = req.body;
  
  console.log(`${req.method} request to /auth/register`);
  console.log(req.body);
  
  let errorMessage = null;
  
  // Validate fields
  if (!username || !email || !password || !confirmPassword) {
      errorMessage = 'All fields are required.';
      return res.render('register', { errorMessage, username, email });
  }

  // Check if passwords match
  if (password !== confirmPassword) {
      errorMessage = 'Passwords do not match.';
      return res.render('register', { errorMessage, username, email });
  }

  try {
      // Check if username already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
          errorMessage = 'Username has already been taken.';
          return res.render('register', { errorMessage, username, email });
      }

      // Check if email already exists
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
          errorMessage = 'Email address already exists.';
          return res.render('register', { errorMessage, username, email });
      }

      // Hash the password (Password pre-save is handled in UserSchema)
      // Create new user
      const newUser = new User({
          username,
          email,
          password, // Password will be hashed via Mongoose pre-save hook
          role: 'user' // Default role
      });

      // Save the user to the database
      await newUser.save();
      
  } catch (error) {
      console.error(error);
      errorMessage = 'An error occurred during registration. Please try again.';
      return res.render('register', { errorMessage, username, email });
  }
next();
},


 /* === Login Routes === */
login: async (req, res, next) => {
  const { email, password } = req.body;
  console.log(`${req.method} request to /auth/login`);
  console.log(req.body);

  let errorMessage = null;

  // Check if email and password are provided
  if (!email || !password) {
      return res.render('login', { errorMessage: 'Please fill in all fields.' });
  }

  try {
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
          console.log("Incorrect Email Address");
          return res.render('login', { errorMessage: 'Invalid Email or password.' });
      }

      // Compare entered password with stored hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          console.log("Incorrect Password");
          return res.render('login', { errorMessage: 'Invalid Email or password.' });
      }

       // If authentication is successful, create a session and redirect to dashboard
      req.session.user = user; // Assuming you're using session-based authentication
      req.session.isAuthenticated = true;
  
}catch (error) {
  console.error(error);
  res.render('login', { errorMessage: 'An error occurred, please try again.' });
} 

console.log(`Authenticated! Welcome ${req.session.user.username}`);
next();
},


/* ==== Logout Routes===== */
logout: async(req, res, next) => {
      // Destroy the session and redirect to login
      req.session.destroy((err) => {
          if (err) {
              return next(err);
          }
      });
      next();
    },

 

/* === Forgot Password === */
  
  forgotPassword: async (req, res, next) => {
    console.log(req.body);
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
    next();
  },

  /* === Reset Password === */
  resetPassword : async (req, res, next) => {
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
    next();
  }
  

};