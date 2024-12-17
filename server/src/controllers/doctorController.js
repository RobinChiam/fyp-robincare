const User = require('../models/user-model');
const Doctor = require('../models/doctor-model');

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const doctor = await User.findById(userId);

    if (!doctor) return res.status(404).json({ error: 'Doctor profile not found' });

    res.status(200).json({
      name: doctor.name || '',
      email: doctor.email || '',
      profilePicture: doctor.profilePicture || '/profile/placeholder.png',
      phone: doctor.phone || '',
      specialization: doctor.specialization || 'General Medicine',
    });
  } catch (err) {
    console.error('Error fetching doctor profile:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const doctor = await User.findById(userId);

    if (!doctor) return res.status(404).json({ error: 'Doctor profile not found' });

    let hasChanges = false;

    // Handle profile picture upload
    if (req.file) {
      if (doctor.profilePicture && doctor.profilePicture !== '/profile/placeholder.png') {
        const oldPath = path.join(__dirname, '../../public/uploads/profile-picture', path.basename(doctor.profilePicture));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      doctor.profilePicture = `/uploads/${req.file.filename}`;
      hasChanges = true;
    }

    // Update other fields
    if (req.body.password && req.body.password !== req.body.confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    } 

    if (req.body.phone && req.body.phone !== doctor.phone) {
      doctor.phone = req.body.phone;
      hasChanges = true;
    }

    if (hasChanges) {
      await doctor.save();
      return res.status(200).json({ message: 'Changes saved successfully' });
    } else {
      return res.status(200).json({ message: 'No changes made' });
    }
  } catch (err) {
    console.error('Error updating doctor profile:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
    .populate({
      path: 'user',
      select: 'name email phone profilePicture'
    });
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
    return res.status(200).json(doctor);
  } catch (err) {
    console.error('Error fetching doctor details:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getProfile, updateProfile, getDoctorById };
