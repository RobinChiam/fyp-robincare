const mongoose = require('mongoose');

const HealthRecordSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    diagnosis: {
        type: String,
        required: true
    },
    medications: [{
        type: String
    }],
    doctorNotes: {
        type: String
    },
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'appointments',  // Reference to Appointment collection
        required: true
    }
}, { timestamps: true }, 
{ collection: 'healthrecords' });

const HealthRecord = mongoose.model('HealthRecord', HealthRecordSchema);
module.exports = HealthRecord;