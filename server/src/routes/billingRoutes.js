const express = require('express');
const router = express.Router();
const { fetchInvoices, payInvoice } = require('../controllers/billingController');

router.get('/my-invoices', fetchInvoices);
router.post('/pay', payInvoice);

module.exports = router;
