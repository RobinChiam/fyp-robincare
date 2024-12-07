const Appointment = require('../models/appointments-model');

const createAppointment = async (req, res) => {
    try {
        const { patientId, doctorId, date, timeSlot } = req.body;

        const newAppointment = new Appointment({ patientId, doctorId, date, timeSlot });
        await newAppointment.save();

        res.status(201).json({ message: 'Appointment created', appointment: newAppointment });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

const getAppointments = async (req, res) => {
    try {
        const { userId, role } = req.user; // Assuming `req.user` contains authenticated user info
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

module.exports = { createAppointment, getAppointments, updateAppointmentStatus };
