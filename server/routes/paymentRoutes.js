const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const paymentController = require('../controllers/paymentController');

// Route to generate sample payments
router.post('/generate-sample-payments', auth, paymentController.generateSamplePayments);

module.exports = router;


W


