const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true }, // Example: "10:30 AM - 11:00 AM"
    status: { type: String, enum: ['pending', 'confirmed', 'rejected'], default: 'pending' },
    reason: { type: String }, // Optional: reason for rejection
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true },
{ collection: 'appointments' });

module.exports = mongoose.model('Appointment', appointmentSchema);
