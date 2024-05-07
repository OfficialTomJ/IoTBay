import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ShoppingCartPage.css';

const ShoppingCartPage = () => {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Product 1', price: 10, quantity: 1 },
    { id: 2, name: 'Product 2', price: 15, quantity: 2 },
    { id: 3, name: 'Product 3', price: 20, quantity: 1 },
  ]);

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
          <div className="total-price-container">
            <h3 className="total-price">Total Price: ${totalPrice}</h3>
          </div>
          <div className="action-buttons">
            <Link to="/products" className="back-button">Back to Products</Link>
            <Link to="/checkout" className="checkout-button">Proceed to Checkout</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingCartPage;
