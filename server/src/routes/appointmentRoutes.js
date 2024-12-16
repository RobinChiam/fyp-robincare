const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getAllAppointments,
  getAppointmentsForUser,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  availableSlots,
  todayAppointments,
  getAppointmentsForDoctor,
  updateAppointmentStatus,
  getAppointments
} = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/authMiddleware');

// Routes
router.post('/create', authMiddleware(['doctor', 'patient']), createAppointment);
router.get('/history', authMiddleware(['patient']), getAppointments);
router.get('/my-appointments', authMiddleware(['doctor', 'patient']), getAppointmentsForUser);
router.get('/doctor-appointments', authMiddleware(['doctor']), getAppointmentsForDoctor);
router.get('/:id', authMiddleware(['doctor', 'patient', 'admin']), getAppointmentById);
router.patch('/:id', authMiddleware(['admin']), updateAppointment);
router.delete('/:id', authMiddleware(['admin']), deleteAppointment);
router.post('/available-slots', authMiddleware(['doctor', 'patient']), availableSlots);
router.get('/doctor-today', authMiddleware(['doctor']), todayAppointments);
router.post('/updateAppointment/:id', authMiddleware(['doctor']), updateAppointmentStatus);
router.get('/', authMiddleware(['admin']), getAllAppointments);


module.exports = router;
