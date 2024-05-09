const express = require('express');
const router = express.Router();

// Import order controller
const orderController = require('../controllers/orderController');

// Define routes
router.post('/create-order', orderController.createOrder);
router.get('/order-details/:orderId', orderController.getOrderDetails);
router.put('/update-order/:orderId', orderController.updateOrder);
router.delete('/cancel-order/:orderId', orderController.cancelOrder);

// Route to create a new order
router.post('/create-order', async (req, res) => {
  try {
    // Create a new order object based on request body
    const newOrder = new Order(req.body);

    // Save the order to the database
    await newOrder.save();

    res.status(201).json(newOrder); // Respond with the newly created order
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Route to update an existing order
router.put('/update-order/:id', auth, orderController.updateOrder);

// Route to delete an existing order
router.delete('/delete-order/:id', auth, orderController.deleteOrder);

module.exports = router;

