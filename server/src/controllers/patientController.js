const Patient = require('../models/patient-model');
const User = require('../models/user-model');
const fs = require('fs');
const path = require('path');

const getProfile = async (req, res) => {
    try {
      //console.log(`User ID: ${req.user.id}`);
      const userId = req.user.id; // Adjust to match your auth setup
      //console.log(`User ID: ${userId}`);
      const profile = await Patient.findOne({ user: userId }).populate('user', 'name email profilePicture phone');
  
      if (!profile) return res.status(404).json({ error: 'Profile not found' });
  
      const response = {
        address: profile.address || '',
        medicalHistory: profile.medicalHistory || [],
        phone: profile.user.phone || '',
        profilePicture: profile.user.profilePicture || '/profile/placeholder.png', // Default placeholder
        name: profile.user.name || '',
        email: profile.user.email || '',
      };
  
      res.status(200).json(response);
    } catch (err) {
      console.error('Error fetching profile:', err);
      res.status(500).json({ error: 'Server error' });
    }
  };

  const updateProfile = async (req, res) => {
    try {
      const userId = req.user.id; // Adjust to match your auth setup
      const patient = await Patient.findOne({ user: userId }).populate('user');
  
      if (!patient) return res.status(404).json({ error: 'Profile not found' });
  
      let hasChanges = false;
  
      // Update profile picture using multer
      if (req.file) {
        // Delete the old profile picture if it exists
        if (patient.user.profilePicture && patient.user.profilePicture !== '/profile/placeholder.png') {
          const oldPath = path.join(__dirname, '../../public/uploads/profile-picture', path.basename(patient.user.profilePicture));
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
        patient.user.profilePicture = `/uploads/${req.file.filename}`;
        hasChanges = true;
      }
  
      // Check and update fields only if they are different
      if (req.body.password && req.body.password !== req.body.confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
      } else if (req.body.password) {
        patient.user.password = await bcrypt.hash(req.body.password, 10);
        hasChanges = true;
      }
  
      if (req.body.address && req.body.address !== patient.address) {
        patient.address = req.body.address;
        hasChanges = true;
      }
  
      if (req.body.medicalHistory) {
        const medicalHistoryArray = req.body.medicalHistory.split(',').map((item) => item.trim());
        if (JSON.stringify(medicalHistoryArray) !== JSON.stringify(patient.medicalHistory)) {
          patient.medicalHistory = medicalHistoryArray;
          hasChanges = true;
        }
      }
  
      if (req.body.phone && req.body.phone !== patient.user.phone) {
        patient.user.phone = req.body.phone;
        hasChanges = true;
      }
  
      // Save changes only if there are updates
      if (hasChanges) {
        await patient.save();
        await patient.user.save();
        return res.status(200).json({ message: 'Changes saved successfully' });
      } else {
        return res.status(200).json({ message: 'No changes made' });
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
module.exports = { getProfile, updateProfile };
