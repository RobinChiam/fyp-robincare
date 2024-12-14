const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, updateDoctorInfo, deleteUser, getProfile, updateProfile } = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../config/upload');



router.get('/users', authMiddleware(['admin']), getAllUsers);
router.get('/users/:id', authMiddleware(['admin']), getUserById);
router.post('/doctor/update-info', authMiddleware(['admin']), updateDoctorInfo);
router.delete('/users/:id', authMiddleware(['admin']), deleteUser);
router.get('/profile', authMiddleware(['admin']), getProfile);
router.post('/profile/update', authMiddleware(['admin']), upload.single('profilePicture'), updateProfile);

module.exports = router;
