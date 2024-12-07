const User = require('../models/user-model');

const manageUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

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

module.exports = { manageUsers, updateDoctorInfo };
