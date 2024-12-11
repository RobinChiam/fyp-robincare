const express = require('express');
const router = express.Router();
const { createAppointment, getAppointments, updateAppointmentStatus } = 
require('../controllers/appointmentController');

router.post('/create', createAppointment);
router.get('/my-appointments', getAppointments);
router.post('/update-status', updateAppointmentStatus);

module.exports = router;
