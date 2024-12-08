const express = require('express');
const router = express.Router();
const { loginHandler, registerHandler, forgetPasswordHandler, resetPasswordHandler } = 
require('../controllers/authController');
const { validateInputs } = require('../middleware/validateInputs');

router.post('/login', validateInputs(), loginHandler);
router.post('/register', validateInputs(), registerHandler);
router.post('/forget-password', forgetPasswordHandler);
router.post('/reset-password', resetPasswordHandler);

module.exports = router;
