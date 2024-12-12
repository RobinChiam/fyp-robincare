const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/patientController');
const authMiddleware = require('../middleware/authMiddleware');


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

module.exports = router;
