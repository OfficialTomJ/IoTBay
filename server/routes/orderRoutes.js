const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const orderController = require('../controllers/orderController');

// Routes for managing orders
router.post('/orders/create', auth, orderController.createOrder);
router.put('/orders/update/:id', auth, orderController.updateOrder);
router.delete('/orders/delete/:id', auth, orderController.deleteOrder);
router.post('/orders/checkout', auth, orderController.checkout);

// Routes for managing the shopping cart
router.post('/cart/add', orderController.addToCart);
router.put('/cart/update/:productId', orderController.updateCart);
router.delete('/cart/remove/:productId', orderController.removeFromCart);

// Route to fetch product details by ID
router.get('/product/:id', orderController.getProductById);


module.exports = router;
