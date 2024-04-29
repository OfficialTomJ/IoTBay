const Order = require('../models/Order');

// Controller function to create a new order
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

// Controller function to get order details
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

// Controller function to update an existing order
exports.updateOrder = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const updates = req.body;
        const updatedOrder = await Order.findByIdAndUpdate(orderId, updates, { new: true });
        if (!updatedOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json({ message: 'Order updated successfully', order: updatedOrder });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Controller function to cancel an existing order
exports.cancelOrder = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const canceledOrder = await Order.findByIdAndDelete(orderId);
        if (!canceledOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json({ message: 'Order canceled successfully' });
    } catch (error) {
        console.error('Error canceling order:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Export controller functions
module.exports = {
    createOrder,
    getOrderDetails,
    updateOrder,
    cancelOrder
};
