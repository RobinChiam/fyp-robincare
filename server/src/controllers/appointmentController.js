const Appointment = require('../models/appointments-model');
const moment = require('moment');
const mongoose = require('mongoose');
const Patient = require('../models/patient-model');
const Doctor = require('../models/doctor-model');
const { statusinfo, appointmentInfo } = require('../config/mailer');
require('dotenv').config();

// Create a new appointment
const createAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, date, timeSlot, reason } = req.body;
    console.log(req.body);
    // Check if patient already has an appointment on the same date
    const existingAppointment = await Appointment.findOne({
      patientId,
      date,
      status: { $ne: 'rejected' }, // Exclude rejected appointments
    });

    if (existingAppointment) {
      return res.status(400).json({
        message: 'You already have an appointment booked for this day. Please choose another date.',
      });
    }

    // Check for conflicting time slot
    const conflictingAppointment = await Appointment.findOne({
      doctorId,
      date,
      timeSlot,
      status: { $ne: 'rejected' },
    });

    if (conflictingAppointment) {
      return res.status(400).json({ message: 'Time slot already booked.' });
    }

    // Create new appointment
    const newAppointment = new Appointment({
      patientId,
      doctorId,
      date,
      timeSlot,
      reason,
    });
    
    await newAppointment.save();

        // Fetch doctor and patient details
        const doctor = await Doctor.findById(doctorId).populate('user', 'email name');
        const patient = await Patient.findById(patientId).populate('user', 'name email');
    
        if (doctor && patient) {
          const doctorEmail = doctor.user.email;
          const doctorName = doctor.user.name;
          const patientName = patient.user.name;
    
          await appointmentInfo(req, res, doctorName, doctorEmail , date, timeSlot, patientName);

          console.log(`Email sent to doctor (${doctorEmail}) about the new appointment.`);
        }

    

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

const getAppointments = async (req, res) => {
  console.log('Request received for getAppointments');

  try {
    const { id, role } = req.user;

    if (role === 'patient') {
       // Check if patient record exists
      const patientRecord = await Patient.findOne({ user: id });
      if (!patientRecord) {
        return res.status(404).json({ error: 'Patient record not found' });
      }
  
      const patientId = patientRecord._id;
          // Fetch appointments and populate doctor details
    const appointments = await Appointment.find({ patientId: patientId })
    .populate({
      path: 'doctorId',
      select: 'specialization user',
      populate: { path: 'user', select: 'name email' },
    });

    res.status(200).json(appointments);
    }
   
   else if(role === 'doctor') {
    // Check if doctor record exists
    const doctorRecord = await Doctor.findOne({ user: id });
    if (!doctorRecord) {
      return res.status(404).json({ error: 'Doctor record not found' });    
    }

    const doctorId = doctorRecord._id;
    // Fetch appointments and populate doctor details
    const appointments = await Appointment.find({ doctorId: doctorId })
    .populate({
      path: 'patientId',
      select: 'user',
      populate: { path: 'user', select: 'name email' },
    });
    console.log(appointments);
    res.status(200).json(appointments);
  }
  else{
    return res.status(403).json({ error: 'Unauthorized access' });
  }

   
  } catch (err) {
    console.error("Error fetching appointments:", err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// Fetch appointments for logged-in user
const getAppointmentsForUser = async (req, res) => {
  try {
    const { id, role } = req.user;
    // Validate role
    if (role !== 'patient') {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    // Check if patient record exists
    const patientRecord = await Patient.findOne({ user: id });
    if (!patientRecord) {
      return res.status(404).json({ error: 'Patient record not found' });
    }

    const patientId = patientRecord._id;

    const now = new Date();

    // Fetch appointments and populate doctor details
    const appointments = await Appointment.find({ patientId })
      .populate({
        path: 'doctorId', // Populate the doctor reference
        select: 'specialization user', // Include specialization and user fields
        populate: { path: 'user', select: 'name email' }, // Populate the user field within doctorId
      })
      .sort({ date: 1 });
    if (!appointments || appointments.length === 0) {
      return res.status(200).json({
        futureAppointments: [],
        missedAppointmentsCount: 0,
        totalAppointmentsCount: 0,
      });
    }

    // Filter future and missed appointments
    const futureAppointments = appointments.filter((appt) =>
      new Date(appt.date) >= now && ['pending', 'confirmed'].includes(appt.status)
    );

    const missedAppointments = appointments.filter((appt) =>
      new Date(appt.date) < now && ['pending', 'confirmed'].includes(appt.status)
    );

    // Send response with full appointment objects
    res.status(200).json({
      futureAppointments,
      missedAppointmentsCount: missedAppointments.length,
      totalAppointmentsCount: appointments.length,
    });
  } catch (err) {
    console.error('Error fetching appointments:', err.message);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

const getAppointmentStats = async (req, res) => {
  try {
    const startOfMonth = moment().startOf('month').toDate();
    const endOfMonth = moment().endOf('month').toDate();

    // Total appointments in the current month
    const totalAppointments = await Appointment.countDocuments({
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    // Aggregate to find doctor with the highest appointments
    const doctorAppointments = await Appointment.aggregate([
      { $match: { date: { $gte: startOfMonth, $lte: endOfMonth } } },
      { $group: { _id: "$doctorId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    // Populate doctor details
    let topDoctor = null;
    if (doctorAppointments.length > 0) {
      topDoctor = await Doctor.findById(doctorAppointments[0]._id).populate(
        "user",
        "name email"
      );
    }

    // Aggregate to find doctor with the most missed appointments
    const missedAppointments = await Appointment.aggregate([
      {
        $match: {
          date: { $lt: new Date() },
          status: { $in: ["pending", "confirmed"] },
        },
      },
      { $group: { _id: "$doctorId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    // Populate doctor details for missed appointments
    let missedDoctor = null;
    if (missedAppointments.length > 0) {
      missedDoctor = await Doctor.findById(missedAppointments[0]._id).populate(
        "user",
        "name email"
      );
    }

    res.status(200).json({
      totalAppointments,
      topDoctor: topDoctor
        ? { name: topDoctor.user.name, count: doctorAppointments[0].count }
        : null,
      missedDoctor: missedDoctor
        ? { name: missedDoctor.user.name, count: missedAppointments[0].count }
        : null,
    });
  } catch (error) {
    console.error("Error fetching appointment stats:", error);
    res.status(500).json({ error: "Server error" });
  }
};



const getAppointmentsForDoctor = async (req, res) => {
  try {
    const { id, role } = req.user;

    if (role !== 'doctor') {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    // Get the doctor record
    const doctorRecord = await Doctor.findOne({ user: id });
    if (!doctorRecord) {
      return res.status(404).json({ error: 'Doctor record not found' });
    }
    const doctorId = doctorRecord._id;

    const now = new Date();

    // Fetch appointments and populate patient details
    const appointments = await Appointment.find({ doctorId })
      .populate({
        path: 'patientId',
        populate: { path: 'user', select: 'name email' }, // Populate user's name and email from patient
      })
      .sort({ date: 1 });

    if (!appointments || appointments.length === 0) {
      return res.status(200).json({
        futureAppointments: [],
        missedAppointmentsCount: 0,
        totalAppointmentsCount: 0,
      });
    }

    // Filter future and missed appointments
    const futureAppointments = appointments.filter((appt) =>
      new Date(appt.date) >= now && ['pending', 'confirmed'].includes(appt.status)
    );

    const missedAppointments = appointments.filter((appt) =>
      new Date(appt.date) < now && ['pending', 'confirmed'].includes(appt.status)
    );

    // Send response
    res.status(200).json({
      futureAppointments,
      missedAppointmentsCount: missedAppointments.length,
      totalAppointmentsCount: appointments.length,
    });
  } catch (err) {
    console.error('Error fetching doctor appointments:', err.message);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

// Get a single appointment by ID
const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id)
    .populate({
      path: 'doctorId',
      populate: { path: 'user', select: 'name email' },
    }).populate({
      path: 'patientId',
      populate: { path: 'user', select: 'name email' },
    });
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

const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params; // Appointment ID from the request
    const { status } = req.body; // New status from the request

    if (!['confirmed', 'pending', 'rejected', 'complete'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Return the updated document
    );

    if (!appointment) {
      console.log('Appointment not found');
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    const updatedAppointment = await Appointment.findById(id)
    .populate({
      path: 'patientId',
      populate: { path: 'user', select: 'name email' },
    });
    await statusinfo(req, res, updatedAppointment.patientId.user.name, updatedAppointment.patientId.user.email, appointment.status);

    console.log('Appointment updated successfully');
    res.status(200).json({ message: 'Appointment updated successfully', appointment });
  } catch (err) {
    console.error('Error updating appointment status:', err.message);
    res.status(500).json({ error: 'Server error', details: err.message });
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
  getAppointmentsForDoctor,
  updateAppointmentStatus,
  getAppointments,
  getAppointmentStats,
};
