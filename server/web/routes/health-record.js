const HealthRecord = require('../models/healthrecords-model');  // Import HealthRecord model
const express = require('express');
const router = express.Router();
const Appointment = require('../models/appointments-model');
const Doctor = require('../models/doctor-model');
const User = require('../models/user-model');
const { ensureAuthenticated } = require('../middleware/auth');
const mongoose = require('mongoose');


// Route to show the health record creation page
router.get('/create', ensureAuthenticated, async (req, res) => {
    try {
        const { appointmentId } = req.query;
        
        // Fetch appointment details to pre-fill the health record
        const appointment = await Appointment.findById(appointmentId)
                                             .populate( {                                                
                                                path: 'doctorId',  // Reference to the doctorId field
                                                select: 'name specialization',  // Fields to populate
                                                model: 'Doctor'
                                             })
                                             .populate({
                                                path: 'userId',   // Reference to the userId field
                                                select: 'username email',  // Fields to populate
                                                model: 'User'    // Use the 'User' model
                                            });

        if (!appointment) {
            return res.status(404).send('Appointment not found');
        }

        // Pre-fill doctorNotes with appointment notes
        const preFilledData = {
            userId: appointment.userId._id,
            appointmentId: appointment._id,
            doctorNotes: appointment.notes || ''
        };

        // Render health record creation page
        res.render('create-health-record', { preFilledData, appointment });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Route to save the health record
router.post('/save', ensureAuthenticated, async (req, res) => {
    try {
        const { userId, appointmentId, diagnosis, medications, doctorNotes } = req.body;

        // Create new health record
        const newHealthRecord = new HealthRecord({
            userId: new mongoose.Types.ObjectId(userId),
            appointmentId: new mongoose.Types.ObjectId(appointmentId),
            diagnosis,
            medications: medications ? medications.split(',').map(med => med.trim()) : [],  // Split medications by comma
            doctorNotes: doctorNotes || ''
        });

        await newHealthRecord.save();

        res.redirect('/appointments');  // Redirect to appointments page after saving health record
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Route to view health records (for both admin and users)
router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        let healthRecords;

        // Check if the logged-in user is an admin
        if (req.session.user.role === 'admin') {
            // Admin: Fetch all health records
            healthRecords = await HealthRecord.find({})
            .populate({
                path: 'userId',   
                select: 'username email',  
                model: 'User'   
            })
            .populate({
                path: 'appointmentId',   
                select: 'appointmentDate',  
                model: 'Appointment'   
            });
        } else {
            // Non-admin: Fetch only the logged-in user's health records
            healthRecords = await HealthRecord.find({ userId: req.session.user._id })
            .populate({
                path: 'userId',   
                select: 'username email',  
                model: 'User'    
            })
            .populate({
                path: 'appointmentId',   
                select: 'appointmentDate',  
                model: 'Appointment'   
            });
        }

        // Render the health records view
        res.render('health-records', { healthRecords });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;