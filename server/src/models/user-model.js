const mongoose = require('mongoose');
//const bcrypt = require('bcryptjs');

/* ============== Schema for User Database Object ================ */
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'doctor'], required: true },
    name: { type: String, required: true }, 
    phone: { type: String },
    specialization: { type: String }, // For doctors only
    consultationHours: {
        start: { type: String }, // Example: "09:00"
        end: { type: String },   // Example: "17:00"
    },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
