import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/order'; 

// Function to create a new order
export const createOrder = async (orderData) => {
    try {
        const response = await axios.post(`${BASE_URL}/create-order`, orderData);
        return response.data;
    } catch (error) {
        console.error('Error creating order:', error);
        throw new Error('Failed to create order');
    }
};

// Function to get order details by order ID
export const getOrderDetails = async (orderId) => {
    try {
        const response = await axios.get(`${BASE_URL}/order-details/${orderId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching order details:', error);
        throw new Error('Failed to fetch order details');
    }
};

// Function to update an existing order by order ID
export const updateOrder = async (orderId, updatedOrderData) => {
    try {
        const response = await axios.put(`${BASE_URL}/update-order/${orderId}`, updatedOrderData);
        return response.data;
    } catch (error) {
        console.error('Error updating order:', error);
        throw new Error('Failed to update order');
    }
};

// Function to cancel an existing order by order ID
export const cancelOrder = async (orderId) => {
    try {
        const response = await axios.delete(`${BASE_URL}/cancel-order/${orderId}`);
        return response.data;
    } catch (error) {
        console.error('Error canceling order:', error);
        throw new Error('Failed to cancel order');
    }
};

// Function to get all orders
export const getAllOrders = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/all-orders`);
        return response.data;
    } catch (error) {
        console.error('Error fetching all orders:', error);
        throw new Error('Failed to fetch all orders');
    }
};
