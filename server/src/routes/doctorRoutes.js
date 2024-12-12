const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/patientController');
const Doctor = require('../models/doctor-model');
const User = require('../models/user-model');
const authMiddleware = require('../middleware/authMiddleware');


router.get('/profile', authMiddleware(), getProfile);
router.post('/profile/update', authMiddleware(), updateProfile);
router.get('/list', authMiddleware(), async (req, res) => {
    try {
        const doctors = await Doctor.find({}, 'specialization consultationHours')
          .populate('user', 'name email phone');
    
        if (doctors.length === 0) {
          return res.status(200).json([]);
        }
    
        res.status(200).json(doctors);
      } catch (error) {
        console.error('Error fetching doctors:', error.message);
        res.status(500).json({ message: 'Error fetching doctors' });
      }
});

router.get('/chats', authMiddleware(['doctor']), async (req, res) => {
    try {
      const { id } = req.user;
      const chats = await Chat.find({ doctorId: id }).populate('patientId', 'name');
      if (chats.length === 0) {
        return res.status(200).json([]);
      }
      res.status(200).json(chats.map(chat => ({
        patientName: chat.patientId.name,
        lastMessage: chat.messages[chat.messages.length - 1]?.content || 'No messages yet.',
        timestamp: chat.messages[chat.messages.length - 1]?.timestamp || chat.createdAt,
      })));
    } catch (error) {
      console.error('Error fetching chats:', error.message);
      res.status(500).json({ message: 'Error fetching chats' });
    }
  });

//router.post('/create-chats', authMiddleware(["doctor"]), async (req, res) => {

    //Create Chat with Patient under Doctor.

//});

//router.post('/update-chats', authMiddleware(["doctor"])), async (req, res) => {

    //Update Chat with Patient under Doctor.

//});

module.exports = router;
