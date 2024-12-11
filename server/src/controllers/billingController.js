const Invoice = require('../models/invoice-model');

const fetchInvoices = async (req, res) => {
    try {
        const { userId } = req.session.user._id;
        const invoices = await Invoice.find({ patientId: userId });

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

module.exports = { fetchInvoices, payInvoice };
