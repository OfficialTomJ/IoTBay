const Order = require('../models/Order');
const AccessLog = require('../models/AccessLog');
const Shipment = require('../models/Shipment');
const Payment = require('../models/Payment');

exports.createOrder = async (req, res) => {
  try {
    // Create a new order object based on request body
    const newOrder = new Order(req.body);

    // Save the order to the database
    await newOrder.save();

    // Log the event in the access log
    AccessLog.create({
      eventType: 'order_created',
      userId: req.user.id,
    });

    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};
// Export controller functions
module.exports = {
    createOrder,
    getOrderDetails,
    updateOrder,
    cancelOrder
};