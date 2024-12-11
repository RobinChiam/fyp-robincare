const InsuranceClaim = require('../models/claims-model');

const submitClaim = async (req, res) => {
    try {
        const { patientId, insuranceCompany, claimNumber, amountClaimed } = req.body;

        const newClaim = new InsuranceClaim({ patientId, insuranceCompany, claimNumber, amountClaimed });
        await newClaim.save();

        res.status(201).json({ message: 'Insurance claim submitted', claim: newClaim });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

const getClaims = async (req, res) => {
    try {
        const userId = req.session.user._id;
        const claims = await InsuranceClaim.find({ patientId: userId });

        res.status(200).json(claims);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { submitClaim, getClaims };
