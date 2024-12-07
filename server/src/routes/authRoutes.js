const express = require('express');
const router = express.Router();
const { loginHandler, registerHandler, forgetPasswordHandler, resetPasswordHandler } = 
require('../controllers/authController');

router.post('/login', loginHandler);
router.post('/register', registerHandler);
router.post('/forget-password', forgetPasswordHandler);
router.post('/reset-password', resetPasswordHandler);

module.exports = router;
