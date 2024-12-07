const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.send('Welcome to the Healthcare Management System'));
router.get('/about-us', (req, res) => res.send('About Us Page'));
router.get('/contact-us', (req, res) => res.send('Contact Us Page'));

module.exports = router;
