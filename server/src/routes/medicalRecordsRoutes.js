const express = require('express');
const router = express.Router();
const { addRecord, getRecords, createHealthRecord, getRecordById, getAllHealthRecords, getRecordByHash, completeAppointment } = require('../controllers/medicalRecordsController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../config/upload');

router.post('/add', authMiddleware(), addRecord);
router.get("/records", authMiddleware(["patient"]), getRecords);
router.get("/record/:id", authMiddleware(["patient"]), getRecordById);
router.get('/my-records', authMiddleware(['patient']), getRecords);
router.post("/create", authMiddleware(['doctor']), upload.array("files", 5), completeAppointment);
router.get('/all', authMiddleware(['admin']), getAllHealthRecords);
router.get('/hash/:recordId', authMiddleware(['admin']), getRecordByHash);
// router.get('/:id', authMiddleware(['patient']), getRecordById);
module.exports = router;
