const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/patientController');
const authMiddleware = require('../middleware/authMiddleware');
const Patient = require('../models/patient-model')
const mongoose = require('mongoose');


router.get('/profile', authMiddleware(), getProfile);
router.post('/profile/update', authMiddleware(), updateProfile);
router.get('/list', authMiddleware(['admin']), async (req, res) => {
    try {
      const patients = await Patient.find().select('name email phone');
      if (patients.length === 0) {
        return res.status(200).json([]);
      }
      res.status(200).json(patients);
    } catch (error) {
      console.error('Error fetching patients:', error.message);
      res.status(500).json({ message: 'Error fetching patients' });
    }
  });

  router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      const objectId = new mongoose.Types.ObjectId(userId); // Convert to ObjectId
      const patient = await Patient.findOne({ user: objectId }).populate('user', '-password');
  
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
  
      res.status(200).json(patient); // Respond with patient data
    } catch (error) {
      console.error('Error fetching patient details:', error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

module.exports = router;
