const express = require('express');
const router = express.Router();
const User = require('../models/user-model'); // Adjust the path based on your project structure
const Appointment = require('../models/appointments-model');
const { contactInfo } = require('../config/mailer');
require('dotenv').config();
const upload = require('../config/upload'); 
const Doctor = require('../models/doctor-model'); // Adjust the path as per your project structure
const Patient = require('../models/patient-model');
const authMiddleware = require('../middleware/authMiddleware');


router.get('/users/me', authMiddleware(), async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/appointments/my-appointments', authMiddleware(),async (req, res) => {
    try {
        const userId = req.session.user._id;
        const appointments = await Appointment.find({ patientId: userId });
        
        if (appointments.length === 0) {
            return res.status(200).json({ message: "No appointments found", appointments: [] });
        }

        res.status(200).json(appointments);
    } catch (err) {
        console.error(err); 
        res.status(500).json({ error: 'Server error' });
    }
});
// Example session check route
router.get('/session', (req, res) => {
    if (req.session && req.session.user) {
        return res.status(200).json({ loggedIn: true, user: req.session.user });
    }
    return res.status(401).json({ loggedIn: false });
});

router.post('/contact', async (req, res) => {
    try {
    const { name, email, message } = req.body;
    await contactInfo(req, res, name, message, email);
    console.log(`Email from ${email} to ${process.env.CONTACT_MAIL}!`);
    res.status(200).json({ message: 'Email sent successfully' });
    } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
    }
});

// Route to handle profile picture upload
router.post('/profilePic', upload.single('profilePicture'), async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
      }
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      let filePath;
      // Check if a file was uploaded
      if (req.file) {
        filePath = `/uploads/${req.file.filename}`;
        user.profilePicture = filePath;
      } else {
        user.profilePicture = '/profile/placeholder.png'; // Default placeholder
      }
  
      await user.save();
  
      res.status(200).json({
        message: 'Profile picture updated successfully!',
        filePath: user.profilePicture, // Return the saved profile picture path
      });
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      res.status(500).json({ message: 'An error occurred while uploading the profile picture.' });
    }
  });

  router.post('/create-user', async (req, res) => {
    try {
        const { icNumber, email, password, role, name, dob, gender, phone, profilePicture } = req.body;

        // Check for existing user by email or IC number
        const existingUser = await User.findOne({ $or: [{ email }, { icNumber }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User with the provided email or IC number already exists' });
        }

        // Create the User entry
        const newUser = new User({
            icNumber,
            email,
            password, // Ideally, hash the password before saving it (use bcrypt or another library)
            role,
            name,
            dob,
            gender,
            phone,
            profilePicture
        });

        const savedUser = await newUser.save();
        res.status(201).json({ message: 'User created successfully', user: savedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
});


  router.post('/create-doctor', async (req, res) => {
    try {
        const { user, specialization, consultationHours } = req.body;

        // Validate referenced User
        const userExists = await User.findById(user);
        if (!userExists) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the User's role is 'doctor'
        if (userExists.role !== 'doctor') {
            return res.status(400).json({ message: 'User must have a role of doctor' });
        }

        // Create the Doctor entry
        const newDoctor = new Doctor({
            user,
            specialization,
            consultationHours
        });

        const savedDoctor = await newDoctor.save();
        res.status(201).json({ message: 'Doctor created successfully', doctor: savedDoctor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
});

router.post('/create-patient', async (req, res) => {
    try {
        const { user, address, medicalHistory } = req.body;

        // Validate required fields
        if (!user) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Check if the referenced User exists
        const userExists = await User.findById(user).lean();
        if (!userExists) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Validate the User's role
        if (userExists.role !== 'patient') {
            return res.status(400).json({ message: 'User must have a role of patient' });
        }

        // Validate the format of medicalHistory (optional field)
        if (medicalHistory && !Array.isArray(medicalHistory)) {
            return res.status(400).json({ message: 'Medical history must be an array of strings' });
        }

        // Create the Patient entry
        const newPatient = new Patient({
            user,
            address: address || '', // Default to empty string if address is not provided
            medicalHistory: medicalHistory || [], // Default to empty array if medicalHistory is not provided
        });

        const savedPatient = await newPatient.save();
        res.status(201).json({ message: 'Patient created successfully', patient: savedPatient });
    } catch (error) {
        console.error('Error in /create-patient:', error);
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
});



module.exports = router;

