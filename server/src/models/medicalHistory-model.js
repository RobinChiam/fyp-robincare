/* Schema for Medical History */

const mongoose = require('mongoose');

const medicalHistorySchema = new mongoose.Schema({
    healthRecords: [{ type: mongoose.Schema.Types.ObjectId, ref: 'HealthRecord' }],
    hash: { type: String },
    createdAt: { type: Date, default: Date.now },
  }, { timestamps: true },
  { collection: 'medical-history' });

  medicalHistorySchema.pre('save', function(next) {
    if (this.isModified()) {
      this.hasChanged = Math.random().toString(36).substr(2, 9);
    }
    next();
  });

  module.exports = mongoose.model('MedicalHistory', medicalHistorySchema);
  