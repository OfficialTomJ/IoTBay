const Order = require('../models/Order');
const AccessLog = require('../models/AccessLog');

exports.createOrder = async (req, res) => {
    try {
        // Extract order data from request body
        const { userId, products } = req.body;

        // Create new order instance
        const newOrder = new Order({
            userId,
            products
        });

    // Save the order to the database
    await newOrder.save();

        // Return success response
        res.status(201).json({ message: 'Order created successfully' });
    } catch (error) {
        // Handle error
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Controller function to get order details by order ID
exports.getOrderDetails = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Controller function to update an existing order by order ID
exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedOrder = await Order.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    await Order.findByIdAndDelete(id);
    res.status(204).send(); // No content response
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
};
