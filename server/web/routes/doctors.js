const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ensureAuthenticated, isAdmin } = require('../middleware/auth');
const Doctor = require('../models/doctor-model'); // Assuming you already have this model
const Appointment = require('../models/appointments-model');

// Route to GET the list of doctors
router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        // Fetch all doctors from the database
        const doctors = await Doctor.find().sort({ name: 1 }); // Sort doctors by name alphabetically
        
        // Render the doctors.ejs view and pass the list of doctors
        res.render('doctors', { doctors , error: null});
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Route to display the Add Doctor form
router.get('/add', ensureAuthenticated, isAdmin, (req, res) => {

    res.render('add-doctors', {error: null});
});

// Route to handle Add Doctor form submission
router.post('/add', ensureAuthenticated, isAdmin, async (req, res) => {
    const { name, specialization, yearsOfExperience, age, availability } = req.body;

    // Simple validation
    if (!name || !specialization || !yearsOfExperience || !age || !availability) {
        return res.render('add-doctors', { error: 'Please fill in all fields' });
    }

    try {
        // Create new doctor object
        const newDoctor = new Doctor({
            name,
            specialization,
            yearsOfExperience,
            age,
            availability
        });

        // Save the new doctor to the database
        await newDoctor.save();

        // Redirect to the doctors list page
        res.redirect('/doctors');
    } catch (err) {
        console.error(err);
        res.render('add-doctors', { error: 'An error occurred while adding the doctor. Please try again.' });
    }
});

/*==================== */

// Route to display the Edit Doctor form
router.get('/edit/:id', ensureAuthenticated, isAdmin, async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).send('Doctor not found');
        }
        res.render('edit-doctor', { doctor });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Route to handle Edit Doctor form submission
router.post('/edit/:id', ensureAuthenticated, isAdmin, async (req, res) => {
    const { name, specialization, yearsOfExperience, age, availability } = req.body;

    try {
        // Find the doctor by ID and update its details
        await Doctor.findByIdAndUpdate(req.params.id, {
            name,
            specialization,
            yearsOfExperience,
            age,
            availability
        });

        res.redirect('/doctors');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Route to handle Delete Doctor and reassign their appointments
router.post('/delete/:id', ensureAuthenticated, isAdmin, async (req, res) => {
    try {
        const doctorIdToDelete = req.params.id;

        // Find appointments linked to the doctor
        const doctorAppointments = await Appointment.find({ doctorId: doctorIdToDelete });

        // Check if the doctor has any appointments
        if (doctorAppointments.length > 0) {
            // Find another available doctor to reassign the appointments
            const newDoctor = await Doctor.findOne({
                _id: { $ne: doctorIdToDelete }, // Exclude the doctor being deleted
                availability: 'Available'
            });

            if (!newDoctor) {
                // If no available doctor is found, send an error message
                return res.render('doctors', {
                    doctors: await Doctor.find(), // Load doctors list again
                    error: 'No available doctor found to reassign appointments. Please make another doctor available first.'
                });
            }

            // Reassign all appointments to the new doctor
            await Appointment.updateMany(
                { doctorId: doctorIdToDelete },
                { doctorId: newDoctor._id }
            );

            return res.render('doctors', {
                doctors: await Doctor.find(),
                message: `${doctorAppointments.length} appointments reassigned to Doctor: ${newDoctor.name}`,
            });
        }

        // Proceed to delete the doctor
        await Doctor.findByIdAndDelete(doctorIdToDelete);

        res.redirect('/doctors');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;