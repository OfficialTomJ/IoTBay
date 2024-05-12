const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const orderController = require('../controllers/orderController');

// Route to create a new order
router.post('/create-order', auth, orderController.createOrder);

// Route to update an existing order
router.put('/update-order/:id', auth, orderController.updateOrder);

// Route to delete an existing order
router.delete('/delete-order/:id', auth, orderController.deleteOrder);

// Route to handle checkout process
router.post('/checkout', auth, orderController.checkout);


// Route to add items to the cart
router.post('/cart/add', orderController.addToCart);

// Route to update the cart
router.put('/cart/update', orderController.updateCart);

// Route to remove items from the cart
router.delete('/cart/remove/:productId', orderController.removeFromCart);

// Route to checkout and create an order
router.post('/checkout', orderController.checkout);

// Route to fetch product details by ID
router.get('/product/:id', async (req, res) => {
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
});


module.exports = router;
