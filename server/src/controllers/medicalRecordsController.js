const HealthRecord = require('../models/healthrecords-model');
const Patient = require('../models/patient-model');
const fs = require('fs');
const { storeHash, getHash } = require('../../blockchain'); // Import blockchain functions
const MedicalHistory = require('../models/medicalHistory-model');
const crypto = require('crypto');
const path = require('path');
const { medicalRecordInfo } = require("../config/mailer");
const mongoose = require('mongoose');
const ethers = require('ethers');


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
    const patient = await Patient.findOne({ user: req.user.id });
    if (!patient) {
      return res.status(404).json({ error: "Patient not found." });
    }

    const medicalHistory = await MedicalHistory.findOne({ hash: patient.hash }).populate({
      path: "healthRecords",
      populate: {
        path: "doctorId",
        populate: {
          path: "user",
          select: "name",
        },
      },
    });

    if (!medicalHistory) {
      return res.status(404).json({ error: "Medical history not found." });
    }

    // Convert ObjectId to a padded hexadecimal string
    const paddedHistoryId = medicalHistory._id.toString();

    // Verify hash on the blockchain
    const blockchainHash = await getHash(paddedHistoryId);
    if (!(blockchainHash === patient.hash)) {
      return res.status(403).json({ error: "Hash verification failed." });
    }

    res.status(200).json(medicalHistory.healthRecords);
  } catch (error) {
    console.error("Error fetching health records:", error.message);
    res.status(500).json({ error: "Server error." });
  }
};


const getRecordById = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findOne({ user: req.user.id });

    if (!patient) {
      return res.status(404).json({ error: "Patient not found." });
    }

    const medicalHistory = await MedicalHistory.findOne({ hash: patient.hash }).populate({
      path: "healthRecords",
      populate: {
        path: "doctorId",
        populate: {
          path: "user",
          select: "name",
        },
      },
    });

    if (!medicalHistory) {
      return res.status(404).json({ error: "Medical history not found." });
    }

    // Convert ObjectId to a padded hexadecimal string
    const paddedHistoryId = medicalHistory._id.toString();

    // Verify hash on the blockchain
    const blockchainHash = await getHash(paddedHistoryId);
    if (!(blockchainHash === patient.hash)) {
      return res.status(403).json({ error: "Hash verification failed." });
    }

    // if (!medicalHistory.healthRecords.includes(id)) {
    //   return res.status(403).json({ error: "Health record not authorized." });
    // }

    const healthRecord = await HealthRecord.findById(id).populate({
      path: "doctorId",
      populate: {
        path: "user",
        select: "name email",
      },
    });

    if (!healthRecord) {
      return res.status(404).json({ error: "Health record not found." });
    }

    res.status(200).json(healthRecord);
  } catch (error) {
    console.error("Error fetching health record:", error.message);
    res.status(500).json({ error: "Server error." });
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

    if (!mongoose.Types.ObjectId.isValid(patientId) || !mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({ error: "Invalid patient or doctor ID format." });
    }

    const parsedPatientId = new mongoose.Types.ObjectId(patientId);
    const parsedDoctorId = new mongoose.Types.ObjectId(doctorId);

    // Step 1: Create Health Record
    const newRecord = await new HealthRecord({
      patientId: parsedPatientId,
      doctorId: parsedDoctorId,
      appointmentId,
      diagnosis,
      prescription,
      notes,
      attachments: req.files?.map((file) => `/uploads/${file.filename}`) || [],
    }).save({ session });

    // Step 2: Find Patient and Medical History
    const patient = await Patient.findById(parsedPatientId)
    .populate({
      path: 'user',
      select: 'name email',
    })
    .session(session);
    if (!patient) throw new Error("Patient not found.");

    let medicalHistory = await MedicalHistory.findOne({ hash: patient.hash }).session(session);
    if (!medicalHistory) {
      medicalHistory = new MedicalHistory({ healthRecords: [] });
    }

    // Step 3: Update Medical History
    medicalHistory.healthRecords.push(newRecord._id);
    const fullHash = crypto.createHash("sha256").update(Date.now().toString()).digest("hex");
    medicalHistory.hash = `0x${fullHash}`; // Ensure it fits into bytes32, prepend 0x to fullHash;
    await medicalHistory.save({ session });

    // Step 4: Update Patient's Hash
    patient.hash = `0x${fullHash}`; // Ensure it fits into bytes32, prepend 0x to fullHash;
    await patient.save({ session });

    // Step 5: Store Hash on Blockchain
    const truncatedHash = fullHash.substring(0, 64); // Use the first 64 hex characters (32 bytes)
    await storeHash(medicalHistory._id.toString(), truncatedHash);
    

    // Step 6: Send Notification Email
    await medicalRecordInfo(patient.user.name, patient.user.email);

    // Commit Transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "Health record and medical history updated successfully!",
      record: newRecord,
      hash: fullHash,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error in completing appointment:", error.message);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};




module.exports = { addRecord, getRecords, createHealthRecord, getRecordById, getAllHealthRecords, getRecordByHash, completeAppointment }; 
