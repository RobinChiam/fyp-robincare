const HealthRecord = require('../models/healthrecords-model');
const Patient = require('../models/patient-model');

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
        const records = await MedicalRecord.find({ patientId: patientId });
    
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

    // Extract file paths from uploaded files
    const attachments = req.files?.map((file) => file.path) || [];

    const newRecord = new HealthRecord({
      patientId,
      doctorId,
      appointmentId, // Store appointmentId
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


module.exports = { addRecord, getRecords, createHealthRecord };
