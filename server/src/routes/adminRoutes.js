const express = require('express');
const router = express.Router();
const { manageUsers, updateDoctorInfo } = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/users', authMiddleware, manageUsers);
router.post('/doctor/update-info', authMiddleware, updateDoctorInfo);

module.exports = router;
