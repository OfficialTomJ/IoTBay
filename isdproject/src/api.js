import axios from 'axios';

export const fetchProductById = async (productId) => {
  try {
    const response = await axios.get(`/api/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
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
    const response = await axios.post('/api/orders', orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};