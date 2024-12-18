const HealthRecord = require('../models/healthrecords-model');
const Patient = require('../models/patient-model');
const fs = require('fs');
const { storeHash, getHash } = require('../../blockchain'); // Import blockchain functions
const MedicalHistory = require('../models/medicalHistory-model');
const crypto = require('crypto');
const path = require('path');
const { medicalRecordInfo } = require('../config/mailer');


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
  try {
    const { patientId, doctorId, appointmentId, diagnosis, prescription, notes } = req.body;

    if (!patientId || !doctorId || !appointmentId) {
      return res.status(400).json({ error: 'Patient ID, Doctor ID, and Appointment ID are required.' });
    }

    const attachments = req.files?.map((file) => `/uploads/${path.basename(file.path)}`) || [];

    // Create the health record
    const newRecord = new HealthRecord({
      patientId,
      doctorId,
      appointmentId,
      diagnosis,
      prescription,
      notes,
      attachments,
    });

    const savedRecord = await newRecord.save();

    // Hash the health record ID and store it on the blockchain
    const hash = crypto.createHash('sha256').update(savedRecord._id.toString()).digest('hex');
    const txHash = await storeHash(savedRecord._id.toString(), hash);

    console.log('Hash stored on blockchain:', txHash);

    const patient = await Patient.findById(patientId).populate('user', 'name email');
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: patient.user.email,
      subject: 'New Health Record Created',
      html: `<h1>Hello ${patient.user.name},</h1><p>A new health record has been created for you. 
      Please log in to view the details.
      Your Record Hash is ${txHash}
      </p>`,
    });
    res.status(201).json({
      message: 'Health record created successfully!',
      record: savedRecord,
      blockchainTx: txHash,
    });
  } catch (err) {
    console.error('Error creating health record:', err.message);
    res.status(500).json({ error: 'Server error', details: err.message });
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

const getAllHealthRecords = async (req, res) => {
  try {
    const records = await HealthRecord.find()
      .populate({
        path: 'patientId',
        populate: { path: 'user', select: 'name email' },
      })
      .populate({
        path: 'doctorId',
        populate: { path: 'user', select: 'name email' },
      });
      console.log(records);
    res.status(200).json(records);
  } catch (err) {
    console.error('Error fetching all health records:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

const getRecordByHash = async (req, res) => {
  try {
    const { recordId } = req.params;

    // Retrieve the hash from the blockchain
    const recordHash = await getHash(recordId);
    if (!recordHash) {
      return res.status(404).json({ error: 'Hash not found on blockchain.' });
    }

    // Find the health record using the record ID
    const healthRecord = await HealthRecord.findById(recordHash)
      .populate('patientId', 'name email')
      .populate('doctorId', 'name email');

    if (!healthRecord) {
      return res.status(404).json({ error: 'Health record not found in the database.' });
    }

    res.status(200).json({
      message: 'Health record retrieved successfully.',
      record: healthRecord,
      blockchainHash: recordHash,
    });
  } catch (err) {
    console.error('Error retrieving health record by hash:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

const completeAppointment = async (req, res) => {
  const session = await HealthRecord.startSession();
  session.startTransaction();

  try {
    const { patientId, doctorId, appointmentId, diagnosis, prescription, notes } = req.body;

    // Step 1: Create Health Record
    const newRecord = await new HealthRecord({
      patientId,
      doctorId,
      appointmentId,
      diagnosis,
      prescription,
      notes,
      attachments: req.files?.map((file) => `/uploads/${file.filename}`) || [],
    }).save({ session });

    // Step 2: Find Patient and Medical History
    const patient = await Patient.findById(patientId).session(session);
    if (!patient) throw new Error("Patient not found.");

    let medicalHistory = await MedicalHistory.findOne({ hash: patient.hash }).session(session);
    if (!medicalHistory) {
      medicalHistory = new MedicalHistory({ healthRecords: [] });
    }

    // Step 3: Update Medical History
    medicalHistory.healthRecords.push(newRecord._id);
    const hash = crypto.createHash("sha256").update(Date.now().toString()).digest("hex");
    medicalHistory.hash = hash;
    await medicalHistory.save({ session });

    // Step 4: Update Patient's Hash
    patient.hash = hash;
    await patient.save({ session });

    // Step 5: Store Hash on Blockchain
    await storeHash(medicalHistory._id.toString(), hash);

    // Step 6: Send Notification Email
    await medicalRecordInfo(req, res, patient.user.name, patient.user.email);

    // Commit Transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "Health record and medical history updated successfully!",
      record: newRecord,
      hash,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error in completing appointment:", error.message);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};



module.exports = { addRecord, getRecords, createHealthRecord, getRecordbyId, getAllHealthRecords, getRecordByHash, completeAppointment }; 
