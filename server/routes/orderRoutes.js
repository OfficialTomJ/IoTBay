// In orderRoutes.js or similar

const express = require('express');
const router = express.Router();

// Import order controller
const orderController = require('../controllers/orderController');

// Define routes
router.post('/create-order', orderController.createOrder);
router.get('/order-details/:orderId', orderController.getOrderDetails);
router.put('/update-order/:orderId', orderController.updateOrder);
router.delete('/cancel-order/:orderId', orderController.cancelOrder);

module.exports = router;

