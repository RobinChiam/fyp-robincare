const express = require('express');
const router = express.Router();
const User = require('../models/user-model'); // Adjust the path based on your project structure
const Appointment = require('../models/appointments-model');


router.get('/users/me', async (req, res) => {
    try {
        console.log("Request user:", req.session.user);
        console.log("Request user:", req.session.user._id);
        const userId = req.session.user._id;
        const user = await User.findById(userId).select('-password'); // Exclude sensitive fields like password

        if (!user) {
            console.error("User not found for user:", userId);
            return res.status(404).json({ error: 'User not found' });
        }

        console.log("User found:", user);
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        console.error("Error in /api/users/me route:", err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/appointments/my-appointments', async (req, res) => {
    try {
        const userId = req.session.user._id;
        const appointments = await Appointment.find({ patientId: userId });
        
        if (appointments.length === 0) {
            return res.status(200).json({ message: "No appointments found", appointments: [] });
        }

        res.status(200).json(appointments);
    } catch (err) {
        console.error(err); 
        res.status(500).json({ error: 'Server error' });
    }

// Example session check route
router.get('/session', (req, res) => {
    if (req.session && req.session.user) {
        return res.status(200).json({ loggedIn: true, user: req.session.user });
    }
    return res.status(401).json({ loggedIn: false });
});
});

module.exports = router;

