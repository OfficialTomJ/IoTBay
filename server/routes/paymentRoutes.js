const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const paymentController = require('../controllers/paymentController');


router.post('/create', auth, paymentController.createPayment);
router.get('/user-shipments', auth, paymentController.getUserPayments);

module.exports = router;