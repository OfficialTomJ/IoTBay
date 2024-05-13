const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Routes for managing the shopping cart
router.post('/add', cartController.addToCart);
router.put('/update/:productId', cartController.updateCart);
router.delete('/remove/:productId', cartController.removeFromCart);

module.exports = router;
