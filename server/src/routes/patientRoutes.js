const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getPatientById, getPatientId } = require('../controllers/patientController');
const authMiddleware = require('../middleware/authMiddleware');
const Patient = require('../models/patient-model')
const mongoose = require('mongoose');
const upload = require('../config/upload');


router.get('/profile', authMiddleware('patient', 'doctor', 'admin'), getProfile);
router.post('/profile/update', authMiddleware('patient', 'admin'), upload.single('profilePicture'), updateProfile);
router.get('/list', authMiddleware(['admin']), async (req, res) => {
    try {
      const patients = await Patient.find()
      .populate({
        path: 'user',
        select: 'name email phone',
      });
      if (patients.length === 0) {
        return res.status(200).json([]);
      }
      res.status(200).json(patients);
    } catch (error) {
      console.error('Error fetching patients:', error.message);
      res.status(500).json({ message: 'Error fetching patients' });
    }
  });
  router.get('/id', authMiddleware(['patient']), getPatientId);

  router.get('/:id', authMiddleware(['admin', 'patient', 'doctor']), getPatientById);    

module.exports = router;
