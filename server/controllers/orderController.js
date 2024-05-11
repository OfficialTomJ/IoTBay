const Order = require('../models/Order');
const AccessLog = require('../models/AccessLog');
const Shipment = require('../models/Shipment');
const Payment = require('../models/Payment');

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
        const orderId = req.params.orderId;
        const updatedData = req.body;

        // Find the order by ID and update it
        const updatedOrder = await Order.findByIdAndUpdate(orderId, updatedData, { new: true });

        // Check if the order was found and updated successfully
        if (!updatedOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Return success response
        res.json({ message: 'Order updated successfully', updatedOrder });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Controller function to cancel an existing order by order ID
exports.cancelOrder = async (req, res) => {
    try {
        const orderId = req.params.orderId;

        // Find the order by ID and delete it
        const deletedOrder = await Order.findByIdAndDelete(orderId);

        // Check if the order was found and deleted successfully
        if (!deletedOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Return success response
        res.json({ message: 'Order canceled successfully', deletedOrder });
    } catch (error) {
        console.error('Error canceling order:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
