const HealthRecord = require('../models/healthrecords-model');

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
        const { id } = req.user;
        const records = await MedicalRecord.find({ patientId: id });
    
        if (records.length === 0) {
          return res.status(200).json([]);
        }
    
        res.status(200).json(records);
      } catch (error) {
        console.error('Error fetching medical records:', error.message);
        res.status(500).json({ message: 'Error fetching medical records' });
      }
};

module.exports = { addRecord, getRecords };
