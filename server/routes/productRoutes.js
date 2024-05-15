const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const productController = require('../controllers/productController');

router.post('/create', productController.createProduct);
router.get('/product', auth, productController.getProduct);
router.delete('/delete', auth, productController.deleteProduct);
router.put('/update', auth, productController.updateProduct);

router.get('/product/:id', auth, productController.getProductById);
router.get('/products', (req, res) => {

    res.send('This is the /products route');
});

module.exports = router;
