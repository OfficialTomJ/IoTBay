import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { fetchProductById } from './api';
import { addToCart, removeFromCart } from './cartService';
import { Link } from 'react-router-dom';
import './ShoppingCartPage.css';

const ShoppingCartPage = () => {
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

  const handleAddToCart = (productId, quantity) => {
    addToCart(productId, quantity);
    setCartItems((prevCartItems) => {
      const existingItemIndex = prevCartItems.findIndex((item) => item.id === productId);
      if (existingItemIndex !== -1) {
        const updatedCartItems = [...prevCartItems];
        updatedCartItems[existingItemIndex].quantity = quantity;
        return updatedCartItems;
      } else {
        const newCartItem = fetchProductById(productId).then((product) => ({
          ...product,
          quantity,
        }));
        return [...prevCartItems, newCartItem];
      }
    });
  };

  const handleRemoveFromCart = (productId) => {
    removeFromCart(productId);
    setCartItems((prevCartItems) =>
      prevCartItems.filter((item) => item.id !== productId)
    );
  };

  const decreaseQuantity = (id) => {
    const updatedCartItems = cartItems.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
    );
    setCartItems(updatedCartItems);
  };

  const increaseQuantity = (id) => {
    const updatedCartItems = cartItems.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updatedCartItems);
  };

  const removeItem = (id) => {
    const updatedCartItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCartItems);
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="shopping-cart-container">
      <h1 className="page-title">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p className="empty-cart-message">Your cart is empty.</p>
      ) : (
        <div>
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <div className="item-details">
                <h3 className="item-name">{item.name}</h3>
                <p className="item-price">Price: ${item.price}</p>
                <div className="quantity-controls">
                  <button onClick={() => decreaseQuantity(item.id)} className="quantity-button">-</button>
                  <span className="item-quantity">{item.quantity}</span>
                  <button onClick={() => increaseQuantity(item.id)} className="quantity-button">+</button>
                </div>
              </div>
              <button onClick={() => removeItem(item.id)} className="remove-button">Remove</button>
            </div>
          ))}
          <div className="total-price">
            <h3>Total Price: ${totalPrice}</h3>
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
