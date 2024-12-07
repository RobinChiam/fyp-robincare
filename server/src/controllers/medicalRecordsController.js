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
        const { userId } = req.user;
        const records = await HealthRecord.find({ patientId: userId });

        res.status(200).json(records);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { addRecord, getRecords };
