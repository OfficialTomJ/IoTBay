import React, { useState, useEffect } from 'react';
import './OrderPage.css';
import { addToCart, getAllOrders, cancelOrder, searchOrderByNumber, searchOrderByDate } from './orderService';

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
      await addToCart(newOrderData.orderId); // Changed 'userId' to 'orderId'
      console.log('Item added to cart:', newOrderData.orderId); // Changed 'userId' to 'orderId'
      setNewOrderData({ ...newOrderData, items: [...newOrderData.items, newOrderData.orderId] }); // Changed 'userId' to 'orderId'
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
      console.error('Error searching orders:', error);
    }
  };

  return (
    <div className="order-management-container">
      <h1 className="page-title">Order Management</h1>
      <button className="logout-button">Logout</button>

      {/* Create New Order Section */}
      <div className="section">
        <h2 className="sub-heading">Add to Cart</h2>
        <div className="form-row">
          <label>Order ID:</label>
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
