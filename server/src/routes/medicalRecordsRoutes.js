const express = require('express');
const router = express.Router();
const { addRecord, getRecords, createHealthRecord } = require('../controllers/medicalRecordsController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../config/upload');

router.post('/add', authMiddleware(), addRecord);
router.get('/my-records', authMiddleware(), getRecords);
router.post('/create', authMiddleware(['doctor']), upload.array('files', 10), createHealthRecord);

module.exports = router;
