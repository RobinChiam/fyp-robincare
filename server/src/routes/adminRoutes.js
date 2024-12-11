const express = require('express');
const router = express.Router();
const { manageUsers, updateDoctorInfo } = require('../controllers/adminController');

router.get('/users', manageUsers);
router.post('/doctor/update-info', updateDoctorInfo);

module.exports = router;
