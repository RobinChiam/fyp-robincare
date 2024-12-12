const express = require('express');
const router = express.Router();
const { createAppointment, getAppointments, todayAppointments, listAppointments } = 
require('../controllers/appointmentController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/create', authMiddleware(['doctor', 'patient']), createAppointment);
router.get('/my-appointments', authMiddleware(['doctor', 'patient']), getAppointments);
router.get('/doctor-today', authMiddleware(['doctor, patient']), todayAppointments);
router.get('/history', authMiddleware(['doctor', 'patient']), listAppointments);

module.exports = router;
