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

