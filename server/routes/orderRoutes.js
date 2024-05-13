const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const orderController = require('../controllers/orderController');

// Routes for managing orders
router.post('/create', auth, orderController.createOrder);
router.get('/', auth, orderController.getOrdersForUser);
router.get('/:id', auth, orderController.getOrderById);
router.delete('/:id', auth, orderController.cancelOrder);

module.exports = router;

