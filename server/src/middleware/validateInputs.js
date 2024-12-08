const validateICOrPassport = (value) => {
    // Validation for Malaysian IC: 6 digits + 2 digits + 4 digits (Example: 990101-01-1234)
    const icPattern = /^\d{6}-\d{2}-\d{4}$/;

    // Validation for Passport: Alphanumeric with 6 to 9 characters
    const passportPattern = /^[A-Z0-9]{6,9}$/;

    return icPattern.test(value) || passportPattern.test(value);
};

const validateInputs = (req, res, next) => {
    const { identifier, email, password, icNumber, role } = req.body;

    // Validate Email
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate Password (Minimum 6 characters)
    if (password && password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Validate IC/Passport Number
    if ((identifier || icNumber) && !validateICOrPassport(identifier || icNumber)) {
        return res.status(400).json({ error: 'Invalid IC/Passport number format' });
    }

    // Validate Role
    if (role && !['admin', 'doctor', 'patient'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
    }

    next();
};

module.exports = validateInputs;
