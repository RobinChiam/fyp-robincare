const crypto = require('crypto');
const Verification = require('../models/verification-model'); // Temporary verification model
const { verifyPINInfo } = require('../config/mailer');
const { body, validationResult } = require('express-validator');
const User = require('../models/user-model');


const registerEmail = ([
  body('icOrPassport').notEmpty().withMessage('IC or Passport is required.'),
  body('fullName').notEmpty().withMessage('Full Name is required.'),
  body('email').isEmail().withMessage('Invalid email format.'),
  body('dob').notEmpty().withMessage('Date of Birth is required.'),
  body('phoneNumber')
    .isMobilePhone()
    .withMessage('Invalid phone number format.'),
  body('gender')
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other.'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters.'),
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match.'),
], async (req, res) => {
  console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { icOrPassport, fullName, email, dob, phoneNumber, gender, password } = req.body;

  try {
    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({ message: 'A verification record already exists for this email. Please check your email for the PIN.' });
    }

    const pin = crypto.randomInt(100000, 999999).toString(); // Generate 6-digit PIN

    // Save temporary user data and PIN in Verification collection
    await Verification.create({
      icOrPassport,
      fullName,
      email,
      dob,
      phone: phoneNumber,
      gender,
      password,
      pin,
      createdAt: new Date(), // Used with TTL index
    });

    verifyPINInfo(req, res, fullName, pin, email); // Send verification email

    res.status(200).json({ message: 'Verification email sent.' });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: 'Registration failed.', error: err.message });
  }
});

module.exports = registerEmail;
