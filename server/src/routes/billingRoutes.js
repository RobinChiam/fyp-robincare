const express = require('express');
const router = express.Router();
const { fetchInvoices, payInvoice } = require('../controllers/billingController');
const Invoice = require('../models/invoice-model');

router.get('/my-invoices', fetchInvoices);
router.post('/pay', payInvoice);
router.get('/summary', async (req, res) => {
    try {
      const totalInvoices = await Invoice.countDocuments({});
      const unpaidInvoices = await Invoice.countDocuments({ status: "Unpaid" });
      const paidInvoices = await Invoice.countDocuments({ status: "Paid" });
  
      res.status(200).json({
        totalInvoices,
        unpaidInvoices,
        paidInvoices,
      });
    } catch (error) {
      console.error("Error fetching invoice summary:", error.message);
      res.status(500).json({ error: "Failed to fetch invoice summary" });
    }
  });

module.exports = router;
