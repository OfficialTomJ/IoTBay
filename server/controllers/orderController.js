const Order = require('../models/Order');
const AccessLog = require('../models/AccessLog');
const Shipment = require('../models/Shipment');
const Payment = require('../models/Payment');

exports.createOrder = async (req, res) => {
  try {
    const { products, quantities, shipmentId, paymentId } = req.body;

    const newOrder = new Order({
      products,
      quantities,
      shipmentId,
      paymentId,
      userId: req.user.id,
    });

    await newOrder.save();

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

exports.getOrdersForUser = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders for user:', error);
    res.status(500).json({ error: 'Failed to fetch orders for user' });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user.id });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    res.status(500).json({ error: 'Failed to fetch order by ID' });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!deletedOrder) {
      return res.status(404).json({ error: 'Order not found or unauthorized' });
    }
    res.status(204).send();
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
