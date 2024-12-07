const mongoose = require('mongoose');

const healthRecordSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Doctor who updated the record
    diagnosis: { type: String, required: true },
    prescription: { type: String },
    visitDate: { type: Date, default: Date.now },
    notes: { type: String },
    attachments: [{ type: String }], // URLs for attached files (e.g., X-rays, reports)
}, { timestamps: true }, 
{ collection: 'healthrecords' });

module.exports = mongoose.model('HealthRecord', healthRecordSchema);
