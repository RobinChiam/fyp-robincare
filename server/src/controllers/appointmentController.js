const Appointment = require('../models/appointments-model');
const moment = require('moment');
const mongoose = require('mongoose');

// Create a new appointment
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

// Fetch all appointments (Admin only)
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate('doctorId patientId', 'name');
    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Fetch appointments for logged-in user
const getAppointmentsForUser = async (req, res) => {
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

const getAppointmentsForDoctor = async (req, res) => {
  try {
    const { id, role } = req.user;

    if (role !== 'doctor') {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const now = new Date();
    const appointments = await Appointment.find({ doctorId: id })
      .populate('patientId', 'name') // Populate patient name
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

// Get a single appointment by ID
const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id).populate('doctorId patientId', 'name');
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.status(200).json(appointment);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Update an appointment
const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedAppointment = await Appointment.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedAppointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.status(200).json({ message: 'Appointment updated successfully.', appointment: updatedAppointment });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete an appointment
const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    await Appointment.findByIdAndDelete(id);

    res.status(200).json({ message: 'Appointment deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get available slots for a doctor on a specific date
const availableSlots = async (req, res) => {
  const { doctorId, date } = req.body;

  if (!doctorId || !date) {
    return res.status(400).json({ error: 'Doctor ID and date are required' });
  }

  try {
    const bookedAppointments = await Appointment.find({ doctorId, date });
    const bookedSlots = bookedAppointments.map((appt) => appt.timeSlot);
    res.status(200).json({ bookedSlots });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching available slots' });
  }
};

// Get today's appointments for a doctor
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

module.exports = {
  createAppointment,
  getAllAppointments,
  getAppointmentsForUser,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  availableSlots,
  todayAppointments,
  getAppointmentsForDoctor
};
