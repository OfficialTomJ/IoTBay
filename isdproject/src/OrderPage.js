import React, { useState, useEffect } from 'react';
import { createOrder, cancelOrder, getAllOrders, deleteOrder } from './orderService'; // Import getAllOrders function
import './OrderPage.css'; // Import CSS for styling

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [newOrderData, setNewOrderData] = useState({
    orderId: '', // Changed 'userId' to 'orderId'
    items: [],
  });
  const [orderHistory, setOrderHistory] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState({
    orderNumber: '',
    date: '',
  });
  const [filteredOrders, setFilteredOrders] = useState([]);

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

  const handleAddToCart = async () => {
    try {
      await createOrder(newOrderData); // Send new order data to the server
      setNewOrderData({ userId: '', products: [], totalCost: 0 }); // Clear input fields after creating order
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

  const handleDeleteOrder = async (orderId) => {
    try {
      await deleteOrder(orderId); // Send request to delete order to the server
      fetchOrders(); // Refresh order list after deleting order
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  // Function to handle editing an order (not implemented)
  const handleEditOrder = (orderId) => {
    // Implement logic for editing an order
    console.log('Edit Order:', orderId);
  };

  // Function to handle logout
  const handleLogout = () => {
    // Clear user authentication state
    localStorage.removeItem('authToken');
    // Redirect to login page or any other action as needed
    window.location.href = '/login';
  };

  return (
    <div className="order-management-container">
      <h1 className="page-title">Order Management</h1>
      {/* Logout Button */}
      <button className="logout-button" onClick={handleLogout}>Logout</button>
      <div className="content-container">
        {/* New Order Form */}
        <div className="new-order-form">
          <h2 className="form-title">Create New Order</h2>
          <input
            className="input-field highlight"
            type="text"
            placeholder="User ID"
            value={newOrderData.userId}
            onChange={(e) => setNewOrderData({ ...newOrderData, userId: e.target.value })}
          />
          {/* Add more input fields for products, total cost, etc. */}
          <button className="create-order-button" onClick={handleCreateOrder}>Create Order</button>
        </div>
        {/* Order History */}
        <div className="order-history">
          <h2 className="order-history-title">Order History</h2>
          {/* Add search functionality */}
          {/* Add filtering based on order number and date */}
          <table className="order-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Order Date</th>
                <th>Total Cost</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.orderDate}</td>
                  <td>{order.totalCost}</td>
                  <td>
                    <button className="edit-order-button" onClick={() => handleEditOrder(order._id)}>Edit</button>
                    <button className="delete-order-button" onClick={() => handleDeleteOrder(order._id)}>Delete</button>
                    <button className="cancel-order-button" onClick={() => handleCancelOrder(order._id)}>Cancel</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;