/* Schema of Patient Data Object */

const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, sparse: true }, // Reference to User object
    address: { type: String, default: '' }, // Optional: Default to an empty string
    medicalHistory: [{ type: String }], // Optional: An array of past medical conditions
    createdAt: { type: Date, default: Date.now },
    hash: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);

