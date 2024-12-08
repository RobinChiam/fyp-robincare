const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema({
    icOrPassport: String,
    fullName: String,
    email: String,
    dob: String,
    password: String,
    pin: String,
    createdAt: { type: Date, expires: '10m' }, // Automatically delete after 10 minutes
  });
  
  module.exports = mongoose.model('Verification', verificationSchema);
  