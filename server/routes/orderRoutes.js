const express = require('express');
const router = express.Router();
const Order = require('../models/Order'); // Import Order model

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

// Route to handle checkout process
router.post('/checkout', auth, orderController.checkout);

module.exports = router;

