const express = require('express');
const router = express.Router();

// Import order controller
const orderController = require('../controllers/orderController');

// Define routes
router.post('/create-order', orderController.createOrder);
router.get('/order-details/:orderId', orderController.getOrderDetails);
router.put('/update-order/:orderId', orderController.updateOrder);
router.delete('/cancel-order/:orderId', orderController.cancelOrder);

// Route to update an existing order
router.put('/update-order/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedOrder = await Order.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// Route to delete an existing order
router.delete('/delete-order/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Order.findByIdAndDelete(id);
    res.status(204).send(); // No content response
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

module.exports = router;

