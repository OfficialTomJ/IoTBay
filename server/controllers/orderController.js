const Order = require('../models/Order');
const AccessLog = require('../models/AccessLog');
const Shipment = require('../models/Shipment');
const Payment = require('../models/Payment');

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

    await newOrder.save();

    // Log the event in the access log
    await AccessLog.create({
      eventType: 'order_created',
      userId: req.user.id,
    });

    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

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
    const deletedOrder = await Order.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!deletedOrder) {
      return res.status(404).json({ error: 'Order not found or unauthorized' });
    }
    res.status(204).send(); // No content response
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
};

exports.checkout = async (req, res) => {
  try {
    const { products, quantities } = req.body;
    const userId = req.user.id;

    const shipment = new Shipment({
      // Populate shipment details based on your requirements
    });
    await shipment.save();

    const payment = new Payment({
      // Populate payment details based on your requirements
    });
    await payment.save();

    const newOrder = new Order({
      products,
      quantities,
      shipmentId: shipment._id,
      paymentId: payment._id,
      userId,
    });
    await newOrder.save();

    await AccessLog.create({
      eventType: 'order_checkout',
      userId,
    });

    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error handling checkout:', error);
    res.status(500).json({ error: 'Failed to handle checkout process' });
  }
};
