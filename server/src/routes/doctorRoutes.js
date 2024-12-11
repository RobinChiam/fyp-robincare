const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/patientController');

router.get('/profile', getProfile);
router.post('/profile/update', updateProfile);

module.exports = router;
