const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'doctors',
        required: true
    },
    appointmentDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled', 'checked-in'],
        default: 'pending'
    },
    purpose: {
        type: String,
        required: true
    },
    notes: {
        type: String 
    }
}, { timestamps: true },
{ collection: 'appointments' });

const Appointment = mongoose.model('Appointment', AppointmentSchema);
module.exports = Appointment;