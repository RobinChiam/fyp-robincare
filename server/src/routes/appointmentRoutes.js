const express = require('express');
const router = express.Router();
const { createAppointment, getAppointments, updateAppointmentStatus, todayAppointments } = 
require('../controllers/appointmentController');

router.post('/create', createAppointment);
router.get('/my-appointments', getAppointments);
router.post('/update-status', updateAppointmentStatus);
router.post('/cancel', updateAppointmentStatus);
router.get('/doctor-today', todayAppointments);

module.exports = router;
