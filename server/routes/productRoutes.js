const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const productController = require('../controllers/productController');

router.post('/create', productController.createProduct);
router.get('/productid', auth, productController.getProductid);
router.delete('/delete', auth, productController.deleteProduct);
router.put('/update', auth, productController.updateProduct);

router.get('/product/:id', auth, productController.getProductById);
router.get('/products', (req, res) => {
    // Your route logic for /products here
    // For example, you can send a response or query the database
    // Replace this comment with your actual logic
    res.send('This is the /products route');
});

module.exports = router;
