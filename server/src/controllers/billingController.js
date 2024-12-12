const Invoice = require('../models/invoice-model');

const fetchInvoices = async (req, res) => {
  try {
    const { id } = req.user;
    const invoices = await Invoice.find({ patientId: id });
    res.status(200).json(invoices);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const payInvoice = async (req, res) => {
  try {
    const { invoiceId } = req.body;
    const invoice = await Invoice.findByIdAndUpdate(
      invoiceId,
      { isPaid: true },
      { new: true }
    );

    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    res.status(200).json({ message: 'Invoice paid successfully', invoice });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find();
        if (invoices.length === 0) {
          return res.status(200).json([]);
        }
        res.status(200).json(invoices);
      } catch (error) {
        console.error('Error fetching invoices:', error.message);
        res.status(500).json({ message: 'Error fetching invoices' });
      }
}

module.exports = { fetchInvoices, payInvoice, getInvoices };
