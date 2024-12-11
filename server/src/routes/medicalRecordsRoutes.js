const express = require('express');
const router = express.Router();
const { addRecord, getRecords } = require('../controllers/medicalRecordsController');

router.post('/add', addRecord);
router.get('/my-records', getRecords);

module.exports = router;
