/* Schema for Medical History */

const mongoose = require('mongoose');

const medicalHistorySchema = new mongoose.Schema({
    healthRecords: [{ type: mongoose.Schema.Types.ObjectId, ref: 'HealthRecord' }],
    hash: { type: String },
    createdAt: { type: Date, default: Date.now },
  }, { timestamps: true },
  { collection: 'medical-history' });

  module.exports = mongoose.model('MedicalHistory', medicalHistorySchema);
  