import React, { useState, useEffect } from 'react';
import { createOrder, cancelOrder, getAllOrders } from './orderService'; // Import getAllOrders function
import './OrderPage.css'; // Import CSS for styling

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [newOrderData, setNewOrderData] = useState({
    userId: '',
    products: [],
    totalCost: 0,
  });

  useEffect(() => {
    fetchOrders(); // Fetch orders when component mounts
  }, []);

  const fetchOrders = async () => {
    try {
      const ordersData = await getAllOrders(); // Fetch orders from the server using getAllOrders
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleCreateOrder = async () => {
    try {
      await createOrder(newOrderData); // Send new order data to the server
      fetchOrders(); // Refresh order list after creating new order
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await cancelOrder(orderId); // Send request to cancel order to the server
      fetchOrders(); // Refresh order list after canceling order
    } catch (error) {
      console.error('Error canceling order:', error);
    }
  };

  return (
    <div className="order-management-container">
      <h1 className="page-title">Order Management</h1>
      {/* New Order Form */}
      <div className="new-order-form">
        <h2 className="form-title">Create New Order</h2>
        <input
          className="input-field"
          type="text"
          placeholder="User ID"
          value={newOrderData.userId}
          onChange={(e) => setNewOrderData({ ...newOrderData, userId: e.target.value })}
        />
        {/* Add more input fields for products, total cost, etc. */}
        <button className="create-order-button" onClick={handleCreateOrder}>Create Order</button>
      </div>
      {/* List of Orders */}
      <div className="order-list">
        <h2 className="order-history-title">Order History</h2>
        {/* Add search functionality */}
        {/* Add filtering based on order number and date */}
        <ul className="order-list-items">
          {orders.map(order => (
            <li key={order._id} className="order-item">
              <div className="order-info">Order ID: {order._id}</div>
              <div className="order-info">Order Date: {order.orderDate}</div>
              <div className="order-info">Total Cost: {order.totalCost}</div>
              {/* Add buttons for updating and canceling orders */}
              <button className="cancel-order-button" onClick={() => handleCancelOrder(order._id)}>Cancel Order</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OrderPage;
