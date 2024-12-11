const Appointment = require('../models/appointments-model');
const moment = require('moment');

const createAppointment = async (req, res) => {
    try {
        const { patientId, doctorId, date, timeSlot } = req.body;

        // Parse the appointment date and time
        const appointmentDate = new Date(date); // Convert the provided date to a Date object
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Strip time from the current date
        const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000); // Current time + 2 hours

        // Validate that the appointment date is not before today
        if (appointmentDate < today) {
            return res.status(400).json({ message: 'Cannot book an appointment for a past date.' });
        }

        // Parse the appointment time
        const appointmentDateTime = new Date(`${date}T${timeSlot.split(' - ')[0]}:00`);

        // Validate that the appointment time is at least 2 hours from now
        if (appointmentDateTime < now) {
            return res.status(400).json({ message: 'Cannot book an appointment in the past.' });
        }

        if (appointmentDateTime < twoHoursFromNow) {
            return res.status(400).json({ message: 'Appointments must be at least 2 hours from now.' });
        }

        // Check if the selected time slot is already booked
        const conflictingAppointment = await Appointment.findOne({
            doctorId,
            date,
            timeSlot,
            status: { $ne: 'rejected' } // Exclude rejected appointments
        });

        if (conflictingAppointment) {
            return res.status(400).json({ message: 'Time slot already booked.' });
        }

        // Create a new appointment
        const newAppointment = new Appointment({ patientId, doctorId, date, timeSlot });
        await newAppointment.save();

        res.status(201).json({ message: 'Appointment created successfully.', appointment: newAppointment });
    } catch (err) {
        console.error('Error creating appointment:', err);
        res.status(500).json({ error: 'Server error' });
    }
};



const getAppointments = async (req, res) => {
    try {
        const { userId, role } = req.session.user; // Assuming `req.user` contains authenticated user info
        let appointments;

        if (role === 'doctor') {
            appointments = await Appointment.find({ doctorId: userId });
        } else if (role === 'patient') {
            appointments = await Appointment.find({ patientId: userId });
        } else {
            return res.status(403).json({ error: 'Unauthorized access' });
        }

        res.status(200).json(appointments);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

const updateAppointmentStatus = async (req, res) => {
    try {
        const { appointmentId, status } = req.body;

        const appointment = await Appointment.findByIdAndUpdate(
            appointmentId,
            { status },
            { new: true }
        );

        if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
        res.status(200).json({ message: 'Appointment status updated', appointment });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

const todayAppointments = async (req, res) => {
    try {
        const doctorId = req.session.user._id; // Assuming req.user is populated by verifyDoctor middleware
        const todayStart = moment().startOf("day").toDate();
        const todayEnd = moment().endOf("day").toDate();
    
        // Fetch today's appointments for the logged-in doctor
        const appointments = await Appointment.find({
          doctor: doctorId,
          date: { $gte: todayStart, $lte: todayEnd },
        });
    
        // Calculate appointment statistics
        const totalAppointments = appointments.length;
        const pendingAppointments = appointments.filter(
          (appt) => appt.status === "Pending"
        ).length;
        const completedAppointments = appointments.filter(
          (appt) => appt.status === "Completed"
        ).length;
    
        res.status(200).json({
          totalAppointments,
          pendingAppointments,
          completedAppointments,
          appointments,
        });
      } catch (error) {
        console.error("Error fetching doctor's appointments:", error.message);
        res.status(500).json({ error: "Failed to fetch appointments" });
      }
    };

module.exports = { createAppointment, getAppointments, updateAppointmentStatus, todayAppointments };
