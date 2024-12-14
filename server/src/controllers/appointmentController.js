const Appointment = require('../models/appointments-model');
const moment = require('moment');

const createAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, date, timeSlot } = req.body;

    const conflictingAppointment = await Appointment.findOne({
      doctorId,
      date,
      timeSlot,
      status: { $ne: 'rejected' },
    });

    if (conflictingAppointment) {
      return res.status(400).json({ message: 'Time slot already booked.' });
    }

    const newAppointment = new Appointment({ patientId, doctorId, date, timeSlot });
    await newAppointment.save();

    res.status(201).json({ message: 'Appointment created successfully.', appointment: newAppointment });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getAppointments = async (req, res) => {
    try {
      const { id, role } = req.user;
  
      if (role !== 'patient') {
        return res.status(403).json({ error: 'Unauthorized access' });
      }
  
      const now = new Date();
      const appointments = await Appointment.find({ patientId: id })
        .populate('doctorId', 'name') // Populate doctor's name
        .sort({ date: 1 });
  
      const futureAppointments = appointments.filter(appt => 
        appt.date >= now && ['pending', 'confirmed'].includes(appt.status));
      const missedAppointments = appointments.filter(appt => 
        appt.date < now && ['pending', 'confirmed'].includes(appt.status));
  
      res.status(200).json({
        futureAppointments,
        missedAppointmentsCount: missedAppointments.length,
        totalAppointmentsCount: appointments.length,
      });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  };
  

const todayAppointments = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const todayStart = moment().startOf('day').toDate();
    const todayEnd = moment().endOf('day').toDate();

    const appointments = await Appointment.find({
      doctorId,
      date: { $gte: todayStart, $lte: todayEnd },
    });

    const totalAppointments = appointments.length;
    const pendingAppointments = appointments.filter((appt) => appt.status === 'Pending').length;
    const completedAppointments = appointments.filter((appt) => appt.status === 'Completed').length;

    res.status(200).json({
      totalAppointments,
      pendingAppointments,
      completedAppointments,
      appointments,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
};

const listAppointments = async (req, res) => {
    try {
        const { id } = req.user;
        const appointments = await Appointment.find({ patientId: id });
    
        if (appointments.length === 0) {
          return res.status(200).json([]);
        }
    
        res.status(200).json(appointments);
      } catch (error) {
        console.error('Error fetching appointment history:', error.message);
        res.status(500).json({ message: 'Error fetching appointment history' });
      }
};

module.exports = { createAppointment, getAppointments, todayAppointments, listAppointments };
