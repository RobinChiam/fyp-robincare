const crypto = require('crypto');
const Verification = require('./models/Verification'); // Temporary verification model
const { verifyPINInfo } = require('./mailer');


registerEmail = async (req, res, next) => {
  const { icOrPassport, fullName, email, dob, password } = req.body;

  try {
    const pin = crypto.randomInt(100000, 999999).toString(); // Generate 6-digit PIN

    // Save temporary user data and PIN in Verification collection
    await Verification.create({
      icOrPassport,
      fullName,
      email,
      dob,
      password,
      pin,
      createdAt: new Date(), // Used with TTL index
    });

    verifyPINInfo(req, res, fullName, pin, email);  // Send verification email

    res.status(200).json({ message: 'Verification email sent.' });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed.', error: err.message });
  }
};

module.exports = registerEmail;


