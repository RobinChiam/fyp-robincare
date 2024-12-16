const HealthRecord = require('../models/healthrecords-model');
const Patient = require('../models/patient-model');
const fs = require('fs');
const path = require('path');

const addRecord = async (req, res) => {
    try {
        const { patientId, doctorId, diagnosis, prescription, notes } = req.body;

        const newRecord = new HealthRecord({ patientId, doctorId, diagnosis, prescription, notes });
        await newRecord.save();

        res.status(201).json({ message: 'Health record added', record: newRecord });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

const getRecords = async (req, res) => {
    try {
        const patientRecord = await Patient.findOne({ user: req.user.id });
        if (!patientRecord) {
          return res.status(404).json({ error: 'Patient record not found' });
        }
        const patientId = patientRecord._id;
        const records = await HealthRecord.find({ patientId: patientId })
        .populate({
          path: 'doctorId',
          populate: { path: 'user', select: 'name profilePicture' }
        })
        .populate({
          path: 'patientId',
          populate: { path: 'user', select: 'name profilePicture' }
        });

        if (records.length === 0) {
          return res.status(200).json([]);
        }
    
        

        res.status(200).json(records);
      } catch (error) {
        console.error('Error fetching medical records:', error.message);
        res.status(500).json({ message: 'Error fetching medical records' });
      }
};

const createHealthRecord = async (req, res) => {
  console.log('Request Received for createHealthRecord:', req.body);
  try {
    const { patientId, doctorId, appointmentId, diagnosis, prescription, notes } = req.body;

    if (!patientId || !doctorId || !appointmentId) {
      return res.status(400).json({ error: "Patient ID, Doctor ID, and Appointment ID are required." });
    }

    // Extract file paths from uploaded files and clean them
    const attachments = req.files?.map((file) => `/uploads/${path.basename(file.path)}`) || [];

    // Check for and delete old attachments if necessary
    attachments.forEach((attachment) => {
      const fullPath = path.join(__dirname, '../../public', attachment);
      if (fs.existsSync(fullPath)) {
        console.log('Attachment already exists:', fullPath);
      }
    });

    const newRecord = new HealthRecord({
      patientId,
      doctorId,
      appointmentId,
      diagnosis,
      prescription,
      notes,
      attachments,
    });

    await newRecord.save();

    res.status(201).json({ message: "Health record created successfully", record: newRecord });
  } catch (err) {
    console.error("Error creating health record:", err.message);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

const getRecordbyId = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await HealthRecord.findById(id)
      .populate({
        path: 'doctorId',
        populate: { path: 'user', select: 'name email' },
      })
      .populate({
        path: 'patientId',
        populate: { path: 'user', select: 'name email' },
      });

    if (!record) {
      return res.status(404).json({ error: 'Health record not found' });
    }

    res.status(200).json(record);
  } catch (err) {
    console.error("Error fetching health record details:", err.message);
    res.status(500).json({ error: 'Server error' });
  }
};


module.exports = { addRecord, getRecords, createHealthRecord, getRecordbyId };
