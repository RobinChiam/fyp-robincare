const User = require('../models/user-model');

const getProfile = async (req, res) => {
    try {
        const userId = req.session.user._id;
        const profile = await User.findById(userId);

        if (!profile) return res.status(404).json({ error: 'Profile not found' });
        res.status(200).json(profile);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

const updateProfile = async (req, res) => {
    try {
        const userId = req.session.user._id;        
        const updatedProfile = await User.findByIdAndUpdate(
            userId,
            req.body,
            { new: true }
        );

        if (!updatedProfile) return res.status(404).json({ error: 'Profile not found' });
        res.status(200).json(updatedProfile);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { getProfile, updateProfile };
