const User = require('../models/user-model');
const Appointment = require('../models/appointments-model');
const Patient = require('../models/patient-model');
const Doctor = require('../models/doctor-model');
const { contactInfo } = require('../config/mailer');
const { storeHash, getHash } = require('../../blockchain');
const crypto = require('crypto');

// Unsubscribe from emails
const unsubscribeFromEmails = async (req, res) => {
  try {
    const userId = req.user.id;
    await User.findByIdAndUpdate(userId, { subscribedToEmails: false });
    res.status(200).json({ message: 'Successfully unsubscribed from email notifications.' });
  } catch (err) {
    console.error('Error unsubscribing:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get user appointments
const getUserAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const appointments = await Appointment.find({ patientId: userId });
    res.status(200).json(appointments.length ? appointments : { message: 'No appointments found' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Contact email handler
const contactEmailHandler = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    await contactInfo(req, res, name, message, email);
    res.status(200).json({ message: 'Email sent successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send email.' });
  }
};

// Store hash to blockchain
const storeRecordHash = async (req, res) => {
  const { recordId, recordHash } = req.body;
  try {
    const txHash = await storeHash(recordId, recordHash);
    res.json({ success: true, txHash });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to store hash.' });
  }
};

// Get hash from blockchain
const getRecordHash = async (req, res) => {
  const { recordId } = req.params;
  try {
    const hash = await getHash(recordId);
    res.json({ success: true, hash });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to retrieve hash.' });
  }
};

// Update profile picture
const updateProfilePicture = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required.' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const filePath = req.file ? `/uploads/${req.file.filename}` : '/profile/placeholder.png';
    user.profilePicture = filePath;
    await user.save();

    res.status(200).json({ message: 'Profile picture updated successfully!', filePath });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading profile picture.' });
  }
};

module.exports = {
  unsubscribeFromEmails,
  getUserProfile,
  getUserAppointments,
  contactEmailHandler,
  storeRecordHash,
  getRecordHash,
  updateProfilePicture,
};
