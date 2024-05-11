import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { fetchProductById, createShipment, createPayment, createOrder } from '../services/api';

const CheckoutPage = () => {
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentDetails, setPaymentDetails] = useState('');
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const cart = Cookies.get('cart') ? JSON.parse(Cookies.get('cart')) : {};
        const productIds = Object.keys(cart);

        const items = [];
        for (const productId of productIds) {
          const product = await fetchProductById(productId);
          items.push({ ...product, quantity: cart[productId] });
        }
        setCartItems(items);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems();
  }, []);

  const handleCheckout = async () => {
    try {
      // Create shipment
      const shipmentId = await createShipment();
      // Create payment
      const paymentId = await createPayment();
      
      // Construct order data
      const products = cartItems.map((item) => item.id);
      const quantities = cartItems.map((item) => item.quantity);
      const orderData = {
        products,
        quantities,
        shipmentId,
        paymentId,
      };

      // Create order
      const orderResponse = await createOrder(orderData);
      console.log('Order created:', order);
      
      // Clear cart cookie
      Cookies.remove('cart');
      
      // Redirect to success/thank you page or perform other actions
    } catch (error) {
      console.error('Error during checkout:', error);
      // Display error message to the user
    }
  };

  return (
    <div>
      <h1>Checkout Page</h1>
      {/* Populate cart items */}
      <ul>
        {cartItems.map((item) => (
          <li key={item.id}>
            {item.name} - Quantity: {item.quantity}
          </li>
        ))}
      </ul>
      {/* Collect shipping address */}
      <input type="text" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} />
      {/* Collect payment details */}
      <input type="text" value={paymentDetails} onChange={(e) => setPaymentDetails(e.target.value)} />
      {/* Button to trigger checkout */}
      <button onClick={handleCheckout}>Checkout</button>
    </div>
  );
};

export default CheckoutPage;
