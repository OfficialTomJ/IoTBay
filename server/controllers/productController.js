const Product = require('../models/Product');
const AccessLog = require('../models/AccessLog');

exports.createProduct = async (req, res) => {
    const { name, type, price, quantity } = req.body;
    try {
        if (!name || !type || !price || !quantity) {
            return res.status(400).json({ error: 'Please provide all required fields' });
        }
        if (isNaN(price) || isNaN(quantity) || price <= 0 || quantity <= 0) {
            return res.status(400).json({ error: 'Price and quantity must be positive numbers' });
        }

        const existingProduct = await Product.findOne({ name });
        if (existingProduct) {
            return res.status(400).json({ error: 'Product already exists' });
        }

        const product = await Product.create({ name, type, price, quantity });

        await ProductLog.create({ eventType: 'product_created', productId: product._id });

        res.json({ message: 'Product created successfully', product });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Server Error' });
    }
};

exports.getProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ product });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Server Error' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        await Product.deleteOne({ _id: productId });

        await ProductLog.create({ eventType: 'product_deleted', productId });

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Server Error' });
    }
};

exports.updateProduct = async (req, res) => {
    const { name, type, price, quantity } = req.body;
    const productId = req.params.id;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        if (name) product.name = name;
        if (type) product.type = type;
        if (price) product.price = price;
        if (quantity) product.quantity = quantity;
        await product.save();

        res.json({ message: 'Product updated successfully', product });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Server Error' });
    }
};
