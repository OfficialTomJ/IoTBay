const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const productController = require('../controllers/productController');

router.post('/create', productController.createProduct);
router.get('/profile', auth, productController.getProduct);
router.delete('/delete', auth, productController.deleteProduct);
router.put('/update', auth, productController.updateProduct);
router.get('/logs', auth, productController.getProductLogs);

module.exports = router;