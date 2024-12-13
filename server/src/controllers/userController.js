const User = require('../models/user-model');
const Doctor = require('../models/doctor-model');
const Patient = require('../models/patient-model');
const bcrypt = require('bcrypt');

// Create User
const createUser = async (req, res) => {
    try {
        const { icNumber, email, password, role, name, dob, gender, phone, profilePicture } = req.body;
        const existingUser = await User.findOne({ $or: [{ email }, { icNumber }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email or IC number already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ icNumber, email, password: hashedPassword, role, name, dob, gender, phone, profilePicture });
        const savedUser = await newUser.save();

        if (role === 'doctor') {
            await Doctor.create({ user: savedUser._id, specialization: req.body.specialization, consultationHours: req.body.consultationHours });
        } else if (role === 'patient') {
            await Patient.create({ user: savedUser._id, address: req.body.address, medicalHistory: req.body.medicalHistory });
        }

        res.status(201).json({ message: 'User created successfully', user: savedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};

module.exports = { createUser };
