const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const { ensureAuthenticated, isAdmin } = require('../middleware/auth');

// Get all patients (accessible to authenticated users)
router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const patients = await Patient.find();
        res.render('patients', { patients });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Add new patient form (accessible only to admin users)
router.get('/new', ensureAuthenticated, isAdmin, (req, res) => {
    res.render('add-patient');
});

// Add new patient (POST request, accessible only to admin users)
router.post('/', ensureAuthenticated, isAdmin, async (req, res) => {
    const { name, age, condition } = req.body;
    try {
        const newPatient = new Patient({
            name,
            age,
            condition
        });
        await newPatient.save();
        res.redirect('/patients');
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Edit patient form (accessible only to admin users)
router.get('/edit/:id', ensureAuthenticated, isAdmin, async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        res.render('edit-patient', { patient });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Update patient (PUT request, accessible only to admin users)
router.post('/edit/:id', ensureAuthenticated, isAdmin, async (req, res) => {
    const { name, age, condition } = req.body;
    try {
        await Patient.findByIdAndUpdate(req.params.id, { name, age, condition });
        res.redirect('/patients');
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Delete patient (DELETE request, accessible only to admin users)
router.post('/delete/:id', ensureAuthenticated, isAdmin, async (req, res) => {
    try {
        await Patient.findByIdAndDelete(req.params.id);
        res.redirect('/patients');
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;