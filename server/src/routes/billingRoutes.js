const express = require('express');
const router = express.Router();
const { fetchInvoices, payInvoice, getInvoices, createInvoice, getInvoiceById } = require('../controllers/billingController');
const Invoice = require('../models/invoice-model');
const authMiddleware = require('../middleware/authMiddleware');
const Patient = require('../models/patient-model');
const Doctor = require('../models/doctor-model');

router.get('/my-invoices', authMiddleware(['patient']), async (req, res) => {
  try {
    const { id } = req.user;
    const patientRecord = await Patient.findOne({ user: id });
if (!patientRecord) {
  return res.status(404).json({ error: 'Patient record not found' });
}
const patientId = patientRecord._id;
    const invoices = await Invoice.find({ patientId: patientId })
    .populate({
      path: 'patientId',
      populate: { path: 'user', select: 'name email' },
    })
    .populate({
      path: 'doctorId',
      populate: { path: 'user', select: 'name email' },
    })
    .sort({ isPaid: 1, date: -1 }); // Sort unpaid first, then by date
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
router.post('/create', authMiddleware(['doctor']), createInvoice);
router.get('/invoice/:id', authMiddleware(['patient', 'doctor', 'admin']), getInvoiceById);

module.exports = router;
