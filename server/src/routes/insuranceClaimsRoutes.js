const express = require('express');
const router = express.Router();
const { submitClaim, getClaims } = require('../controllers/insuranceClaimsController');

router.post('/submit', submitClaim);
router.get('/my-claims', getClaims);

module.exports = router;
