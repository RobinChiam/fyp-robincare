const express = require('express');
const router = express.Router();
const Appointment = require('../models/appointments-model');
const Doctor = require('../models/doctor-model');
const User = require('../models/user-model');
const { ensureAuthenticated } = require('../middleware/auth');
const mongoose = require('mongoose');

// Route to show 'Book Appointment' page
router.get('/book', ensureAuthenticated, async (req, res) => {
    // Render book-appointment.ejs
    res.render('book-appointment', {error: null});
});

// Route to handle appointment booking
router.post('/book', ensureAuthenticated, async (req, res) => {
    try {
        const { appointmentDate, purpose } = req.body;
        const userId = req.session.user._id;

        // Convert appointmentDate to a Date object
        const appointmentDateObj = new Date(appointmentDate);

        // Get today's date
        const today = new Date();

        // Check if the appointment date is in the past or today
        if (appointmentDateObj <= today) {
            // req.session.errorMessage = 'Appointments cannot be made in the past or for today. Please select a future date.';
            return res.status(400).send('Appointments cannot be made in the past or for today. Please select a future date.');
            // res.redirect('/appointments/book');
        }

        // Check if the user has another appointment within a 3-day range
        const threeDaysBefore = new Date(appointmentDateObj);
        threeDaysBefore.setDate(threeDaysBefore.getDate() - 3);
        
        const threeDaysAfter = new Date(appointmentDateObj);
        threeDaysAfter.setDate(threeDaysAfter.getDate() + 3);

        const userAppointments = await Appointment.find({
            userId: userId,
            appointmentDate: { 
                $gte: threeDaysBefore, 
                $lte: threeDaysAfter 
            }
        });

        if (userAppointments.length > 0) {
            // req.session.errorMessage = 'You cannot book another appointment within 3 days of an existing one.';
            // res.redirect('/appointments/book');
            return res.status(400).send('You cannot book another appointment within 3 days of an existing one.');
        }

        // Find a random doctor who is available and has no appointments during the requested time
        const doctor = await Doctor.aggregate([
            { $match: { availability: 'Available' } },
            { $sample: { size: 1 } }
        ]);

        if (!doctor.length) {
            // req.session.errorMessage = 'No doctors are currently available.';
            // res.redirect('/appointments/book');
            return res.status(400).send('No doctors are currently available.');
        }

        const selectedDoctorId = doctor[0]._id;

        // Check if the selected doctor already has an appointment at the same time or within a 1-hour range
        const oneHourBefore = new Date(appointmentDateObj);
        oneHourBefore.setHours(oneHourBefore.getHours() - 1);
        
        const oneHourAfter = new Date(appointmentDateObj);
        oneHourAfter.setHours(oneHourAfter.getHours() + 1);

        const overlappingAppointments = await Appointment.find({
            doctorId: selectedDoctorId,
            appointmentDate: {
                $gte: oneHourBefore,
                $lte: oneHourAfter
            }
        });

        if (overlappingAppointments.length > 0) {
            return res.status(400).send('The doctor is not available at this time.');
        }

        // Create the new appointment
        const newAppointment = new Appointment({
            userId: new mongoose.Types.ObjectId(userId),
            doctorId: selectedDoctorId,
            appointmentDate: appointmentDateObj,
            purpose: purpose,
            status: 'pending'
        });

        await newAppointment.save();

        // Set doctor's availability to 'Not Available'
        await Doctor.findByIdAndUpdate(selectedDoctorId, { availability: 'Not Available' });

        res.redirect('/appointments');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Route to view appointments
router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        // Check if the logged-in user is an admin
        if (req.session.user.role === 'admin') {
            // Admin: Fetch all appointments
            const appointments = await Appointment.find({})
                                                  .populate({
                                                      path: 'doctorId',  // Reference to the doctorId field
                                                      select: 'name specialization',  // Select fields to populate
                                                      model: 'Doctor'  // Explicitly tell Mongoose to use the Doctor model
                                                  })
                                                  .populate({
                                                      path: 'userId',  // Reference to the userId field
                                                      select: 'username email',  // Select fields to populate
                                                      model: 'User'  // Explicitly tell Mongoose to use the User model
                                                  })
                                                  .sort({ appointmentDate: -1 });

            res.render('admin-appointments', { appointments, errorMessage: req.session.errorMessage || null });

        } else {
            // Non-admin: Fetch only the logged-in user's appointments
            const appointments = await Appointment.find({ userId: req.session.user._id.toString() })
                                                  .populate({
                                                      path: 'doctorId',  // Reference to the doctorId field
                                                      select: 'name specialization',  // Select the fields you want to populate
                                                      model: 'Doctor'   // Explicitly tell Mongoose to use the Doctor model
                                                  })
                                                  .sort({ appointmentDate: -1 });

            res.render('view-appointment', { appointments });
        }

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Route to cancel appointment
router.post('/cancel/:id', async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (appointment) {
            appointment.status = 'cancelled';
            appointment.notes = req.body.notes;
            await appointment.save();
        }
        res.redirect('/appointments');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Route to view appointment details
router.get('/:id', ensureAuthenticated, async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
                                             .populate({
                                                 path: 'doctorId',  // Reference to the doctorId field
                                                 select: 'name specialization',  // Fields to populate
                                                 model: 'Doctor'   // Use the 'Doctor' model
                                             })
                                             .populate({
                                                 path: 'userId',   // Reference to the userId field
                                                 select: 'username email',  // Fields to populate
                                                 model: 'User'    // Use the 'User' model
                                             });
        res.render('detail-appointment', { appointment });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Route to update a single appointment
router.post('/update/:id', ensureAuthenticated, async (req, res) => {
    const appointmentId = req.params.id;
    const { status, notes } = req.body;

    try {
        // Check if notes are valid
        if ((status === 'cancelled' || status === 'completed') && (!notes || notes.trim() === '')) {
            req.session.errorMessage = 'Notes cannot be empty when the appointment is cancelled or completed.';
            return res.redirect('/appointments');
        }

        // Find the appointment to get the doctorId
        const appointment = await Appointment.findById(appointmentId);

        // Update the appointment status and notes
        await Appointment.findByIdAndUpdate(appointmentId, {
            status,
            notes: notes.trim(),
        });

        // If status is 'completed', update doctor's availability to 'Available'
        if (status === 'completed') {
            await Doctor.findByIdAndUpdate(appointment.doctorId, { availability: 'Available' });
            return res.redirect(`/health-record/create?appointmentId=${appointmentId}`);
        }

        // Clear any previous error messages and redirect to appointments page
        req.session.errorMessage = null;
        res.redirect('/appointments');
    } catch (err) {
        console.error(err);
        req.session.errorMessage = 'An error occurred while updating the appointment.';
        res.redirect('/appointments');
    }
});



module.exports = router;