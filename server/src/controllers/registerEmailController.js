const crypto = require('crypto');
const Verification = require('../models/verification-model'); // Temporary verification model
const { verifyPINInfo } = require('../config/mailer');
const { body, validationResult } = require('express-validator');


registerEmail = (  [
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
],async (req, res, next) => {

  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { icOrPassport, fullName, email, dob, phoneNumber, gender, password } = req.body; // Include new fields

  try {
    const pin = crypto.randomInt(100000, 999999).toString(); // Generate 6-digit PIN

    // Save temporary user data and PIN in Verification collection
    await Verification.create({
      icOrPassport,
      fullName,
      email,
      dob,
      phoneNumber, 
      gender, 
      password,
      pin,
      createdAt: new Date(), // Used with TTL index
    });

    verifyPINInfo(req, res, fullName, pin, email);  // Send verification email
    console.log(`Email sent to ${email}`);

    res.status(200).json({ message: 'Verification email sent.' });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed.', error: err.message });
  }
});

module.exports = registerEmail;


