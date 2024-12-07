const express = require('express');
// const passport = require('passport');
// const bcrypt = require('bcryptjs'); // For password hashing
const User = require('../models/user-model'); // Assuming you have a User model
const router = express.Router();
//const crypto = require('crypto');
const { ensureAuthenticated,checkAuthenticated, logout, login, register, forgotPassword, resetPassword } = require('../middleware/auth');
//const { info } = require('../config/mailer');
const upload = require('../config/upload');


/* ===== GET Requests ===== */

router.get('/', checkAuthenticated, (req, res) => 
{
    res.redirect('/login');
});

// Registration page
router.get('/register', checkAuthenticated, (req, res) => {
    res.render('register');
});

// Login page
router.get('/login', checkAuthenticated, (req, res) => {
    res.render('login');
    console.log(`Status Code: ${res.statusCode}`);
});

/* ===== POST Requests ===== */

/* === Register routes === */
router.post('/register', register, (req, res) => {
    // Redirect to login after successful registration
    res.redirect('/auth/login');
});

/* === Login Routes === */
router.post('/login', login, (req, res) => {
        res.redirect('/dashboard');

});

/* ==== Logout Routes===== */
router.get('/logout', logout, async(req, res) => {

            res.redirect('/auth/login'); // Redirect to login page after session is destroyed
        });


/*==== Password Reset Routes ==== */

/* Forgot Password */

router.get('/forgot-password', (req, res) => {
    res.render('forgot-password');
});

router.post('/forgot-password', forgotPassword, (req, res) => {

    res.render('forgot-password', { successMessage: 'An email has been sent with password reset instructions.' });
    });

/* === Reset Password === */
router.get('/reset-password/:token', async (req, res) => {

    try{
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }, // Ensure the token has not expired
          });
        if (!user) {
            return res.render('reset-password', { errorMessage: 'Token has expired. Please request a new password reset.' });
        }
    
    res.render('reset-password', { token: req.params.token });

    }catch (error) {
        console.error(error);
        res.render('reset-password', { errorMessage: 'An error occurred. Please try again.' });
      }
});

router.post('/reset-password/:token', resetPassword, (req, res) => {
    res.redirect('/auth/login');
});

/* === Edit Account === */

// GET route to display account edit form
router.get('/edit', ensureAuthenticated, (req, res) => {
    // Render the edit form with current user data
    res.render('edit-account', { user: req.session.user }); // Pass user object to the form
});

// POST route to handle account update
router.post('/edit', ensureAuthenticated, upload.single('profilePicture'), async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;
    let errorMessage;

    // console.log(req.session.user._id);
    try {
        // Find the logged-in user
        const user = await User.findById(req.session.user._id.toString());

        // Validate the new data
        if (!username || !email) {
            errorMessage = 'Username and email are required.';
            return res.render('edit-account', { user: req.session.user, errorMessage });
        }

        // Check if passwords match if the user is changing their password
        if (password && password !== confirmPassword) {
            errorMessage = 'Passwords do not match.';
            return res.render('edit-account', { user: req.session.user, errorMessage });
        }

        // Check if the username already exists (excluding the current user)
        const existingUsername = await User.findOne({ username });
        if (existingUsername && (existingUsername._id.toString() !== req.session.user._id.toString())) {
            errorMessage = 'Username already exists.';
            return res.render('edit-account', { user: req.user, errorMessage });
        }

        // Check if the email already exists (excluding the current user)
        const existingEmail = await User.findOne({ email });
        if (existingEmail && (existingEmail._id.toString() !== req.session.user._id.toString())) {
            errorMessage = 'Email already exists.';
            return res.render('edit-account', { user: req.user, errorMessage });
        }

        // Update user's details
        user.username = username;
        user.email = email;
        if (password) {
            user.password = password; //Password is hashed in Schema
        }

        // Check if a new profile picture was uploaded and update the user's profile picture path
        if (req.file) {
            user.profilePicture = `/uploads/profile-picture/${req.file.filename}`; // Save the file path
        }

        // Save the updated user data
        await user.save();

        req.session.user = user;

        // Success message and redirect
        res.render('edit-account', { user: req.session.user, successMessage: 'Account details updated successfully!' });
    } catch (error) {
        console.error('Error updating account:', error);
        res.render('edit-account', { user: req.session.user, errorMessage: 'An error occurred. Please try again.' });
    }
});


module.exports = router;
