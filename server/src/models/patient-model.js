/* Schema of Patient Data Object */

const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User object
    dob: { type: Date, required: true },
    address: { type: String },
    medicalHistory: [{ type: String }], // List of past medical conditions
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true }, { collection: 'patients' });

module.exports = mongoose.model('Patient', patientSchema);
