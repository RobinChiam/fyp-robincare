const express = require('express');
const router = express.Router();
const { fetchInvoices, payInvoice } = require('../controllers/billingController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/my-invoices', authMiddleware, fetchInvoices);
router.post('/pay', authMiddleware, payInvoice);

module.exports = router;
