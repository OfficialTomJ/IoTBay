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
// Export controller functions
module.exports = {
    createOrder,
    getOrderDetails,
    updateOrder,
    cancelOrder
};