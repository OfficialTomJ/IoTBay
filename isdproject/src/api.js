import axios from 'axios';

export const fetchProductById = async (productId) => {
  try {
    const response = await axios.get(`/api/products/${productId}`);
    return response.data; // Return product data
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error; // Throw error for further handling
  }
};

export const createShipment = async () => {
  try {
    const response = await axios.post('/api/shipments');
    return response.data.shipmentId;
  } catch (error) {
    console.error('Error creating shipment:', error);
    throw error;
  }
};

export const createPayment = async () => {
  try {
    const response = await axios.post('/api/payments');
    return response.data.paymentId;
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
};

export const createOrder = async (orderData) => {
  try {
    // Extract product details and quantity from orderData
    const { products } = orderData;

    // Add each product to the cart
    for (const product of products) {
      await addToCart(product.productId, product.quantity);
    }

    // Create the order
    const response = await axios.post('/api/orders', orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const addToCart = async (productId, quantity) => {
  try {
    // Make a POST request to add the product to the cart
    const response = await axios.post('/api/cart/add', { productId, quantity });
    return response.data; // Return response data
  } catch (error) {
    console.error('Error adding product to cart:', error);
    throw error; // Throw error for further handling
  }
};