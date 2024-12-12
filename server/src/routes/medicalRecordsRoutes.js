const express = require('express');
const router = express.Router();
const { addRecord, getRecords } = require('../controllers/medicalRecordsController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/add', authMiddleware(), addRecord);
router.get('/my-records', authMiddleware(), getRecords);

module.exports = router;
