/* Schema for Doctor Data Object */
const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User object
    specialization: { type: String, required: true },
    consultationHours: {
        start: { type: String }, // Example: "09:00"
        end: { type: String },   // Example: "17:00"
    },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Doctor', doctorSchema);
