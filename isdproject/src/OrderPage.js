import React, { useState, useEffect } from 'react';
import { createOrder, cancelOrder, getAllOrders, deleteOrder } from './orderService'; // Import getAllOrders function
import './OrderPage.css'; // Import CSS for styling

const OrderPage = () => {
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
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const ordersData = await getAllOrders();
      setOrderHistory(ordersData);
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
      console.error('Error adding item to cart:', error);
    }
  };

  const handleSubmitOrder = () => {
    setOrderHistory([...orderHistory, newOrderData]);
    setNewOrderData({ orderId: '', items: [] }); // Changed 'userId' to 'orderId'
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await cancelOrder(orderId);
      const updatedOrders = orderHistory.filter(order => order.id !== orderId);
      setOrderHistory(updatedOrders);
    } catch (error) {
      console.error('Error canceling order:', error);
    }
  };
  
  const handleUpdateOrder = (orderId) => {
    // You need to implement the update logic here
    console.log('Updating order:', orderId);
  };

  const handleSearch = async () => {
    try {
      if (searchCriteria.orderNumber) {
        const searchedOrders = await searchOrderByNumber(searchCriteria.orderNumber);
        setFilteredOrders(searchedOrders);
      } else if (searchCriteria.date) {
        const searchedOrders = await searchOrderByDate(searchCriteria.date);
        setFilteredOrders(searchedOrders);
      }
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
    window.location.href = '/login';
  };

  return (
    <div className="order-management-container">
      <h1 className="page-title">Order Management</h1>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
      <div className="content-container">
        <div className="new-order-form">
          <h2 className="form-title">Create New Order</h2>
          <input
            className="input-field"
            type="text"
            placeholder="Enter Order ID"
            value={newOrderData.orderId}
            onChange={(e) => setNewOrderData({ ...newOrderData, orderId: e.target.value })}
          />
          <button className="create-order-button" onClick={handleCreateOrder}>Create Order</button>
        </div>
        <div className="order-history">
          <h2 className="order-history-title">Order History</h2>
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
