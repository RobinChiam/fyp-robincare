const mongoose = require ('mongoose');

/* ============== Doctor Schema ============== */

const DoctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    specialization: {
        type: String,
        required: true
    },
    yearsOfExperience: {
        type: Number,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    availability: {
        type: String,
        enum: ['Available', 'Not Available'],
        default: 'Available'
    }
}, { timestamps: true }, 
{ collection: 'doctors' });

module.exports = mongoose.model('Doctor', DoctorSchema);
