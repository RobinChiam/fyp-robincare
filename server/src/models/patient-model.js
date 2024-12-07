const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    icNumber: { type: String, unique: true, required: true }, // Malaysian IC or Passport
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    dob: { type: Date, required: true },
    phone: { type: String },
    address: { type: String },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    medicalHistory: [{ type: String }], // List of past medical conditions
    createdAt: { type: Date, default: Date.now },
},    {timestamps: true }, { collection: 'patients' });



module.exports = mongoose.model('Patient', patientSchema);
