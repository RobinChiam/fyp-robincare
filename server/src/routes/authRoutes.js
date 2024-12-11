const express = require('express');
const router = express.Router();
const { loginHandler, registerHandler, forgetPasswordHandler, resetPasswordHandler, logoutHandler } = 
require('../controllers/authController');
const registerEmail = 
require('../controllers/registerEmailController');

router.post('/login', loginHandler);
router.post('/register', registerEmail);
router.post('/verify-pin', registerHandler);
router.post('/forget-password', forgetPasswordHandler);
router.post('/reset-password/:token', resetPasswordHandler);
router.post('/logout', logoutHandler);

module.exports = router;
