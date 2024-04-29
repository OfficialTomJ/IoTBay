const Order = require('../models/Order');
const AccessLog = require('../models/AccessLog');

exports.createOrder = async (req, res) => {
  try {
    const { products, quantities, shipmentId, paymentId } = req.body;

    // Create a new order object
    const newOrder = new Order({
      products,
      quantities,
      shipmentId,
      paymentId,
      userId: req.user.id, // Assuming userId is available in the request
    });

    // Save the order to the database
    await newOrder.save();

    // Log the event in the access log
    await AccessLog.create({
      eventType: 'order_created',
      userId: req.user.id,
    });

    res.status(201).json(newOrder); // Respond with the newly created order
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