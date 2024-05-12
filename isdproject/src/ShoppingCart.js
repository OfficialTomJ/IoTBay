import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios'; // Import axios for API calls
import { fetchProductById } from './api';
import { Link } from 'react-router-dom';
import './ShoppingCartPage.css';

const ShoppingCartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const cartString = Cookies.get('cart') || '{}';
        const cart = JSON.parse(cartString);
        const productIds = Object.keys(cart);
        const itemsFromCart = [];

        for (const productId of productIds) {
          const product = await fetchProductById(productId);
          itemsFromCart.push({ ...product, quantity: cart[productId] });
        }

        setCartItems(itemsFromCart);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems();
  }, []);

  useEffect(() => {
    const fetchSampleCartItems = () => {
      // Sample data for cart items
      const sampleCartItems = [
        { id: 1, name: ' Product 1', price: 10, quantity: 1 },
        { id: 2, name: ' Product 2', price: 15, quantity: 1 },
        { id: 3, name: ' Product 3', price: 20, quantity: 1 },
        // Add more sample items as needed
      ];

      if (cartItems.length === 0) {
        setCartItems(sampleCartItems);
      }
    };

    fetchSampleCartItems();
  }, [cartItems]);

  useEffect(() => {
    const fetchShipmentId = async () => {
      try {
        const shipmentId = await createShipment();
        console.log('Shipment created with ID:', shipmentId);
      } catch (error) {
        console.error('Error creating shipment:', error);
      }
    };

    fetchShipmentId();
  }, []);

  useEffect(() => {
    const fetchPaymentId = async () => {
      try {
        const paymentId = await createPayment();
        console.log('Payment created with ID:', paymentId);
      } catch (error) {
        console.error('Error creating payment:', error);
      }
    };

    fetchPaymentId();
  }, []);

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const decreaseQuantity = (id) => {
    const updatedCartItems = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
    );
    setCartItems(updatedCartItems);
    updateCart(id, Math.max(1, cartItems.find((item) => item.id === id).quantity - 1));
  };

  const increaseQuantity = (id) => {
    const updatedCartItems = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updatedCartItems);
    updateCart(id, cartItems.find((item) => item.id === id).quantity + 5);
  };

  const removeItem = (id) => {
    removeFromCart(id);
    const updatedCartItems = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCartItems);
  };

  const updateCart = (productId, quantity) => {
    // Get the raw cookie string
    const cart = Cookies.get('cart') || '{}';
    console.log('Cart from cookie:', cart); // Log the value of cart
    
    // Parse the JSON string to an object
    let cartObject = {};
    try {
      cartObject = JSON.parse(cart);
    } catch (error) {
      console.error('Error parsing cart JSON:', error);
    }
    
    // Update the cart object
    cartObject[productId] = quantity;
    
    // Stringify the object before setting as cookie
    Cookies.set('cart', JSON.stringify(cartObject), { expires: 7 });
  };
  

  const removeFromCart = (productId) => {
    const cartString = Cookies.get('cart') || '{}'; // Get the raw cookie string
let cart = JSON.parse(cartString); // Parse the JSON string to an object
delete cart[productId];
Cookies.set('cart', JSON.stringify(cart), { expires: 7 }); // Stringify the object before setting as cookie

  };

  const fetchProductById = async (productId) => {
    try {
      const response = await axios.get(`/api/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  };

  const createShipment = async () => {
    try {
      const response = await axios.post('/api/shipments');
      return response.data.shipmentId;
    } catch (error) {
      console.error('Error creating shipment:', error);
      throw error;
    }
  };

  const createPayment = async () => {
    try {
      const response = await axios.post('/api/payments');
      return response.data.paymentId;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  };

  const createOrder = async (orderData) => {
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

  const orderHandler = createOrder; // eslint-disable-line no-unused-vars

  const addToCart = async (productId, quantity) => {
    try {
      // Make an API call to add the product to the cart
      const response = await axios.post('/api/cart/add', { productId, quantity });
      return response.data;
    } catch (error) {
      console.error('Error adding product to cart:', error);
      throw error;
    }
  };


  
  return (
    <div className="shopping-cart-container">
      <h1 className="page-title">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div className="empty-cart-message">
          Your cart is empty.
        </div>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="item-details">
                <div className="item-name">{item.name}</div>
                <div className="item-price">${item.price}</div>
              </div>
              <div className="quantity-controls">
                <button onClick={() => decreaseQuantity(item.id)} className="quantity-button">-</button>
                <span className="item-quantity">{item.quantity}</span>
                <button onClick={() => increaseQuantity(item.id)} className="quantity-button">+</button>
              </div>
              <button onClick={() => removeItem(item.id)} className="remove-button">Remove</button>
            </div>
          ))}
          <div className="total-price">
            <h3>Total Price: ${totalPrice.toFixed(2)}</h3>
            <div className="action-buttons">
              <Link to="/product" className="back-button">Back to Products</Link>
              <Link to="/checkout" className="checkout-button">Proceed to Checkout</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ShoppingCartPage;