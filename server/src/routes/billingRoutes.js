const express = require('express');
const router = express.Router();
const { fetchInvoices, payInvoice, getInvoices } = require('../controllers/billingController');
const Invoice = require('../models/invoice-model');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/my-invoices', authMiddleware(), async (req, res) => {
  try {
    const { id } = req.user;
    const invoices = await Invoice.find({ patientId: id }).sort({ isPaid: 1, date: -1 }); // Sort unpaid first, then by date
    res.status(200).json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/pay', authMiddleware(), payInvoice);
router.get('/summary', authMiddleware(), async (req, res) => {
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
router.get('/all-invoices', authMiddleware(['admin']), getInvoices);

module.exports = router;
