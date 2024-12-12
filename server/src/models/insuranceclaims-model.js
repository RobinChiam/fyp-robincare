/* Schema for InsuranceClaim Data Object */

const mongoose = require('mongoose');

const insuranceClaimSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    insuranceCompany: { type: String, required: true },
    claimNumber: { type: String, unique: true, required: true },
    amountClaimed: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    dateSubmitted: { type: Date, default: Date.now },
});

module.exports = mongoose.model('InsuranceClaim', insuranceClaimSchema);
