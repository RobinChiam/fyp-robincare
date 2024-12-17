const express = require('express');
const router = express.Router();
const { addRecord, getRecords, createHealthRecord, getRecordbyId, getAllHealthRecords, getRecordByHash } = require('../controllers/medicalRecordsController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../config/upload');

router.post('/add', authMiddleware(), addRecord);
router.get('/my-records', authMiddleware(['patient']), getRecords);
router.post('/create', authMiddleware(['doctor']), upload.array('files', 10), createHealthRecord);
router.get('/all', authMiddleware(['admin']), getAllHealthRecords);
router.get('/hash/:recordId', authMiddleware(['admin']), getRecordByHash);
router.get('/:id', authMiddleware(['patient']), getRecordbyId);
module.exports = router;
