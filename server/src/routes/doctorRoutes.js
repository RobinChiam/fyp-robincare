const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/patientController');
const Doctor = require('../models/doctor-model');
const User = require('../models/user-model');

router.get('/profile', getProfile);
router.post('/profile/update', updateProfile);
router.get('/list', async (req, res) => {
    try {
        // Fetch all doctors and populate the 'user' field with specific fields
        const doctors = await Doctor.find({}, 'specialization consultationHours')
        .populate('user', 'name email phone'); // Populate 'user' field with specific fields
        
        console.log(`Doctors: ${doctors}`);
        res.status(200).json(doctors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching doctors' });
    }
});

module.exports = router;
