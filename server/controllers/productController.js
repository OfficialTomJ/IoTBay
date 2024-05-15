const Product = require('../models/product');
const AccessLog = require('../models/AccessLog');

// Function to create a new product
exports.createProduct = async function(req, res) {
    const { name, type, price, quantity } = req.body;
    try {
        // Your logic to create a new product
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

// Function to get product details
exports.getProduct = async function(req, res) {
    try {
        // Your logic to get product details
        const productId = req.params.id;
        // Find the product by ID using a callback function
        Product.findById(productId, function(err, product) {
            if (err) {
                console.error('Error fetching product by ID:', err);
                return res.status(500).json({ error: 'Server Error' });
            }
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }
            res.json({ product });
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Server Error' });
    }
};

// Function to delete a product
exports.deleteProduct = async function(req, res) {
    try {
        // Your logic to delete a product
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

// Function to update a product
exports.updateProduct = async function(req, res) {
    const { name, type, price, quantity } = req.body;
    const productId = req.params.id;
    try {
        // Your logic to update a product
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

// Function to get product details by ID
exports.getProductById = async function(req, res) {
    try {
        // Your logic to fetch product by ID
        const productId = req.params.id;
        // Your logic to fetch product by ID
        res.send(`Product details for ID ${productId}`);
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        res.status(500).json({ error: 'Server Error' });
    }
};
