/* ============== Schema for User Database Object ================ */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    icNumber: { type: String, unique: true, required: true }, // Malaysian IC or Passport
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'doctor', 'patient'], required: true },
    name: { type: String, required: true }, 
    dob: {type: String},
    gender: { type: String, enum: ['male', 'female', 'other'] },
    phone: { type: String },
    createdAt: { type: Date, default: Date.now },
    profilePicture: {
      type: String, // File path to the uploaded image
      default: '/profile/placeholder.png' // Default file path if none is provided
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

/** Compare Password */
userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

/** Password Hashing when .save() */
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model('User', userSchema);
