import React, { useState, useEffect } from 'react';
import './OrderPage.css';
import { addToCart, getAllOrders, cancelOrder, searchOrderByNumber, searchOrderByDate } from './orderService';

const OrderPage = () => {
  const [newOrderData, setNewOrderData] = useState({
    orderId: '',
    items: [],
  });
  const [orderHistory, setOrderHistory] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState({
    orderNumber: '',
    date: '',
  });
  const [cart, setCart] = useState([]);

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

  const handleAddToCart = async (orderId) => {
    try {
      await addToCart(newOrderData.orderId); // Changed 'userId' to 'orderId'
      console.log('Item added to cart:', newOrderData.orderId); // Changed 'userId' to 'orderId'
      setNewOrderData({ ...newOrderData, items: [...newOrderData.items, newOrderData.orderId] }); // Changed 'userId' to 'orderId'
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  const handleSearch = async () => {
    try {
      let searchedOrders;
      if (searchCriteria.orderNumber) {
        searchedOrders = await searchOrderByNumber(searchCriteria.orderNumber);
      } else if (searchCriteria.date) {
        searchedOrders = await searchOrderByDate(searchCriteria.date);
      }
      setOrderHistory(searchedOrders);
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

  const handleCreateOrder = async () => {
    try {
      const newOrder = await createOrder(cart);
      setCart([]);
      setOrderHistory((prevOrderHistory) => [...prevOrderHistory, newOrder]);
    } catch (error) {
      console.error('Error creating order:', error);
    }
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
          <button className="blue-button" onClick={handleAddToCart}>Submit</button>
        </div>
      </div>

      {/* Cart Section */}
      <div className="section">
        <h2 className="sub-heading">Cart</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Order ID</th>
              <th>Name</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {/* Display items in cart */}
          </tbody>
        </table>
      </div>

      {/* Order History Section */}
      <div className="section">
        <h2 className="sub-heading">Order History</h2>
        <div className="search-section">
          <h3>Search Orders</h3>
          <div className="form-row">
            <label>Order Number:</label>
            <input
              className="input-field"
              type="text"
              placeholder="Enter Order Number"
              value={searchCriteria.orderNumber}
              onChange={(e) => setSearchCriteria({ ...searchCriteria, orderNumber: e.target.value })}
            />
          </div>
          <div className="form-row">
            <label>Date:</label>
            <input
              className="input-field"
              type="text"
              placeholder="Enter Date"
              value={searchCriteria.date}
              onChange={(e) => setSearchCriteria({ ...searchCriteria, date: e.target.value })}
            />
          </div>
          <button className="search-button" onClick={handleSearch}>Search</button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Order ID</th>
              <th>User ID</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Display order history or filtered orders */}
          </tbody>
        </table>
      </div>

      {/* Go to Shipment Button */}
      <div className="go-to-shipment-button">
        <button className="blue-button" onClick={() => window.location.href = '/shipment'}>Go to Shipment</button>
      </div>
    </div>
  );
};

export default OrderPage;