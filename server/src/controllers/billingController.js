const Invoice = require('../models/invoice-model');

const fetchInvoices = async (req, res) => {
  try {
    const { id } = req.user;
    const patientRecord = await Patient.findOne({ user: req.user.id });
    if (!patientRecord) {
      return res.status(404).json({ error: 'Patient record not found' });
    }
    const patientId = patientRecord._id;

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

const createInvoice = async (req, res) => {
  try {
    const { patientId, doctorId, amount, description } = req.body;

    const newInvoice = new Invoice({ patientId, doctorId, amount, description });
    await newInvoice.save();

    res.status(201).json({ message: "Invoice created successfully", invoice: newInvoice });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findById(id)
      .populate({
        path: 'doctorId',
        populate: { path: 'user', select: 'name email' },
      })
      .populate({
        path: 'patientId',
        populate: { path: 'user', select: 'name email' },
      });

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    console.log(invoice);
    res.status(200).json(invoice);
  } catch (err) {
    console.error("Error fetching invoice details:", err.message);
    res.status(500).json({ error: 'Server error' });
  }
};


module.exports = { fetchInvoices, payInvoice, getInvoices, createInvoice, getInvoiceById };
