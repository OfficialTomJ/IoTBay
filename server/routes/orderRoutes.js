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

module.exports = router;
