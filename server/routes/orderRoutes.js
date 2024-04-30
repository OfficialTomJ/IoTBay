// In orderRoutes.js or similar

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Route to create a new order
router.post('/create-order', auth, orderController.createOrder);

// Route to update an existing order
router.put('/update-order/:id', auth, orderController.updateOrder);

// Route to delete an existing order
router.delete('/delete-order/:id', auth, orderController.deleteOrder);

// Route to handle checkout process
router.post('/checkout', auth, orderController.checkout);

module.exports = router;

