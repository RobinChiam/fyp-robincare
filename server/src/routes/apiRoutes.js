const express = require('express');
const router = express.Router();
const upload = require('../config/upload');
const authMiddleware = require('../middleware/authMiddleware');
const {
  unsubscribeFromEmails,
  getUserProfile,
  getUserAppointments,
  contactEmailHandler,
  storeRecordHash,
  getRecordHash,
  updateProfilePicture,
} = require('../controllers/apiController');

// Routes
router.get('/users/me', authMiddleware(), getUserProfile);
router.get('/appointments/my-appointments', authMiddleware(), getUserAppointments);

router.post('/contact', contactEmailHandler);
router.post('/profilePic', upload.single('profilePicture'), updateProfilePicture);

router.post('/storeHash', storeRecordHash);
router.get('/getHash/:recordId', getRecordHash);

router.post('/unsubscribe', authMiddleware(), unsubscribeFromEmails);

module.exports = router;
