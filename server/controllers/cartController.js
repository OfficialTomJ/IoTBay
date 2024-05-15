const Order = require('../models/Order');

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

exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    if (!quantity) {
      throw new Error('Quantity is required');
    }
    // Logic to update item quantity in the cart
    res.status(200).json(order);
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ error: 'Failed to update cart' });
  }
};

exports.addItemToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      throw new Error('Product ID is required');
    }
    // Logic to add item to the cart
    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
};