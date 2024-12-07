const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    description: { type: String }, // Example: "Consultation fees"
    isPaid: { type: Boolean, default: false },
    paymentMethod: { type: String, enum: ['credit card', 'cash', 'insurance'], default: 'cash' },
});

module.exports = mongoose.model('Invoice', invoiceSchema);
