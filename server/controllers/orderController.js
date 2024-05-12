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

exports.checkout = async (req, res) => {
  try {
    // Your logic for handling the checkout process
    res.status(200).json({ message: 'Checkout process handled successfully' });
  } catch (error) {
    console.error('Error handling checkout:', error);
    res.status(500).json({ error: 'Failed to handle checkout process' });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Check if the product already exists in the cart
    const existingOrder = await Order.findOne({ productId });
    if (existingOrder) {
      existingOrder.quantity += quantity; // Update quantity
      await existingOrder.save();
      return res.status(200).json(existingOrder);
    }

    // If the product doesn't exist in the cart, create a new order
    const newOrder = new Order({
      productId,
      quantity,
    });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    // Find the order in the cart by productId
    const order = await Order.findOne({ productId });

    if (!order) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    // Update the quantity
    order.quantity = quantity;
    await order.save();
    
    res.status(200).json(order);
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ error: 'Failed to update cart' });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    // Find and remove the order from the cart
    const removedOrder = await Order.findOneAndDelete({ productId });

    if (!removedOrder) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    res.status(200).json(removedOrder);
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

// In your orderController.js file
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
    res.status(204).send(); // No content response
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedOrder = await Order.findOneAndUpdate({ _id: id, userId: req.user.id }, req.body, { new: true });
    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found or unauthorized' });
    }
    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
};

exports.getOrdersForUser = async (req, res) => {
  try {
    const { orderNumber, date } = req.query;
    const query = { userId: req.user.id };
    if (orderNumber) query.orderNumber = orderNumber;
    if (date) query.date = date;
    const orders = await Order.find(query);
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders for user:', error);
    res.status(500).json({ error: 'Failed to fetch orders for user' });
  }
};
