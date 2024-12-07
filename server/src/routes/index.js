const express = require('express');
const router = express.Router();
const { ensureAuthenticated, isAdmin } = require('../middleware/auth');
const Appointment = require('../models/appointments-model');
const Doctor = require('../models/doctor-model');

// Route handler for '/'
router.get('/', ensureAuthenticated, (req, res) => {
    // User is authenticated, redirect to the dashboard
    res.redirect('/dashboard');
});

router.get('/dashboard', ensureAuthenticated, async (req, res) => {
    if (req.session.user.role === 'admin') {
        const totalAppointments = await Appointment.countDocuments(); // Total appointments
        const pendingAppointments = await Appointment.countDocuments({ status: 'pending' }); // Pending appointments
        const availableDoctors = await Doctor.countDocuments({ availability: 'Available' }); // Available doctors

        // Render the admin dashboard with the statistics
        res.render('admin-dashboard', { 
            user: req.session.user, 
            totalAppointments, 
            pendingAppointments, 
            availableDoctors,
            currentRoute: '/dashboard' 
        });
    } else {
        // Regular user dashboard
        res.render('dashboard', { user: req.session.user, currentRoute: '/dashboard' });
    }
});

module.exports = router;
