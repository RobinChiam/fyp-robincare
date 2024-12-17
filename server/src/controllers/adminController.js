const User = require('../models/user-model');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');

// Fetch all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Fetch a user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Update a doctor's info
const updateDoctorInfo = async (req, res) => {
  try {
    const { doctorId, updates } = req.body;
    const updatedDoctor = await User.findByIdAndUpdate(doctorId, updates, { new: true });
    if (!updatedDoctor) return res.status(404).json({ error: 'Doctor not found' });
    res.status(200).json(updatedDoctor);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Adjust based on your auth setup
    const admin = await User.findById(userId);

    if (!admin) return res.status(404).json({ error: 'Admin profile not found' });

    res.status(200).json({
      name: admin.name || '',
      email: admin.email || '',
      profilePicture: admin.profilePicture || '/profile/placeholder.png',
      phone: admin.phone || '',
    });
  } catch (err) {
    console.error('Error fetching admin profile:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const admin = await User.findById(userId);

    if (!admin) return res.status(404).json({ error: 'Admin profile not found' });

    let hasChanges = false;

    // Handle profile picture upload
    if (req.file) {
      if (admin.profilePicture && admin.profilePicture !== '/profile/placeholder.png') {
        const oldPath = path.join(__dirname, '../../public/uploads/profile-picture', path.basename(admin.profilePicture));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      admin.profilePicture = `/uploads/${req.file.filename}`;
      hasChanges = true;
    }

    // Update other fields
    if (req.body.password && req.body.password !== req.body.confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (req.body.phone && req.body.phone !== admin.phone) {
      admin.phone = req.body.phone;
      hasChanges = true;
    }

    if (hasChanges) {
      await admin.save();
      return res.status(200).json({ message: 'Changes saved successfully' });
    } else {
      return res.status(200).json({ message: 'No changes made' });
    }
  } catch (err) {
    console.error('Error updating admin profile:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getAllUsers, getUserById, updateDoctorInfo, deleteUser, getProfile, updateProfile };
