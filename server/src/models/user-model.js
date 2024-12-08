/* ============== Schema for User Database Object ================ */
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    icNumber: { type: String, unique: true, required: true }, // Malaysian IC or Passport
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'doctor', 'patient'], required: true },
    name: { type: String, required: true }, 
    gender: { type: String, enum: ['male', 'female', 'other'] },
    phone: { type: String },
    createdAt: { type: Date, default: Date.now },
    profilePicture: {
      type: String, // File path to the uploaded image
      default: '/img/placeholder.png' // Default file path if none is provided
    },
});

module.exports = mongoose.model('User', userSchema);
