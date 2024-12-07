const express = require('express');
const router = express.Router();
const { createAppointment, getAppointments, updateAppointmentStatus } = 
require('../controllers/appointmentController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/create', authMiddleware, createAppointment);
router.get('/my-appointments', authMiddleware, getAppointments);
router.post('/update-status', authMiddleware, updateAppointmentStatus);

module.exports = router;
