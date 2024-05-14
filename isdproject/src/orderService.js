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

// Function to delete an existing order by order ID
export const addToCart = async (itemId) => {
    try {
        // Make a request to the backend to add the item to the cart
        // Replace 'addToCart' with the actual endpoint on your backend
        const response = await axios.post(`${BASE_URL}/addToCart`, { itemId });
        return response.data;
    } catch (error) {
        console.error('Error adding item to cart:', error);
        throw new Error('Failed to add item to cart');
    }
};

// Function to remove an item from the cart
export const removeFromCart = async (itemId) => {
    try {
        // Make a request to the backend to remove the item from the cart
        // Replace 'removeFromCart' with the actual endpoint on your backend
        const response = await axios.delete(`${BASE_URL}/removeFromCart/${itemId}`);
        return response.data;
    } catch (error) {
        console.error('Error removing item from cart:', error);
        throw new Error('Failed to remove item from cart');
    }
};

// Function to place an order (checkout process)
export const placeOrder = async () => {
    try {
        // Make a request to the backend to place the order
        // Replace 'placeOrder' with the actual endpoint on your backend
        const response = await axios.post(`${BASE_URL}/placeOrder`);
        return response.data;
    } catch (error) {
        console.error('Error placing order:', error);
        throw new Error('Failed to place order');
    }
};
// Function to retrieve details of a specific order by its ID
export const getOrderDetails = async (orderId) => {
    try {
        const response = await axios.get(`${BASE_URL}/order-details/${orderId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching order details:', error);
        throw new Error('Failed to fetch order details');
    }
};

// Function to filter orders based on order status (e.g., completed orders)
export const getOrderHistory = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/order-history`);
        return response.data;
    } catch (error) {
        console.error('Error fetching order history:', error);
        throw new Error('Failed to fetch order history');
    }
};

// Function to search for orders based on order number
export const searchOrderByNumber = async (orderNumber) => {
    try {
        const response = await axios.get(`${BASE_URL}/search-order?orderNumber=${orderNumber}`);
        return response.data;
    } catch (error) {
        console.error('Error searching orders by order number:', error);
        throw new Error('Failed to search orders by order number');
    }
};

// Function to search for orders based on order date
export const searchOrderByDate = async (orderDate) => {
    try {
        const response = await axios.get(`${BASE_URL}/search-order?orderDate=${orderDate}`);
        return response.data;
    } catch (error) {
        console.error('Error searching orders by order date:', error);
        throw new Error('Failed to search orders by order date');
    }
};

