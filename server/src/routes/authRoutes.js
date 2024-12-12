const express = require('express');
const router = express.Router();
const { loginHandler, registerHandler, forgetPasswordHandler, resetPasswordHandler } = 
require('../controllers/authController');
const registerEmail = 
require('../controllers/registerEmailController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/login', loginHandler);
router.post('/register', registerEmail);
router.post('/verify-pin', registerHandler);
router.post('/forget-password', forgetPasswordHandler);
router.post('/reset-password/:token', resetPasswordHandler);

module.exports = router;
