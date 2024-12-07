const express = require('express');
const router = express.Router();
const { submitClaim, getClaims } = require('../controllers/insuranceClaimsController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/submit', authMiddleware, submitClaim);
router.get('/my-claims', authMiddleware, getClaims);

module.exports = router;
