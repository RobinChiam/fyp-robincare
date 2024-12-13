const express = require('express');
const router = express.Router();
const { createAppointment, getAppointments, todayAppointments, listAppointments } = 
require('../controllers/appointmentController');
const authMiddleware = require('../middleware/authMiddleware');
const Appointment = require('../models/appointments-model');


router.post('/create', authMiddleware(['doctor', 'patient']), createAppointment);
router.get('/my-appointments', authMiddleware(['doctor', 'patient']), getAppointments);
router.get('/doctor-today', authMiddleware(['doctor', 'patient']), todayAppointments);
router.get('/history', authMiddleware(['doctor', 'patient']), listAppointments);
router.post('/available-slots', async (req, res) => {
    const { doctorId, date } = req.body;
  
    console.log('Received request:', { doctorId, date }); // Debug incoming request

    // Validate the input
    if (!doctorId || !date) {
      return res.status(400).json({ error: 'Doctor ID and date are required' });
    }
  
    try {
      // Check the format of the date
      const isValidDate = !isNaN(new Date(date).getTime());
      if (!isValidDate) {
        return res.status(400).json({ error: 'Invalid date format' });
      }
  
      const bookedAppointments = await Appointment.find({ doctorId, date });
      const bookedSlots = bookedAppointments.map(appt => appt.timeSlot);
      res.status(200).json({ bookedSlots });
    } catch (error) {
      console.error('Error fetching available slots:', error.message);
      res.status(500).json({ error: 'Error fetching available slots' });
    }
  });
  

module.exports = router;
