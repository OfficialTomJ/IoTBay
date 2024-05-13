import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import './ShoppingCartPage.css';

const ShoppingCartPage = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Initialize cart with sample products when component mounts
    const initializeCart = () => {
      const sampleProducts = [
        { id: '1', name: 'Sample Product 1', price: 10, quantity: 1 },
        { id: '2', name: 'Sample Product 2', price: 10, quantity: 1 },
        { id: '3', name: 'Sample Product 3', price: 10, quantity: 1 },
        { id: '4', name: 'Sample Product 4', price: 10, quantity: 1 },
        { id: '5', name: 'Sample Product 5', price: 10, quantity: 1 },
      ];

      setCartItems(sampleProducts);
      saveCartToCookies(sampleProducts);
    };

    initializeCart();
  }, []);

  // Function to save cart items to cookies
  const saveCartToCookies = (items) => {
    const cartObject = {};
    items.forEach(item => {
      cartObject[item.id] = item.quantity;
    });
    Cookies.set('cart', JSON.stringify(cartObject), { expires: 7 });
  };

  // Increase quantity of a product
  const increaseQuantity = (id) => {
    const updatedCartItems = cartItems.map(item => {
      if (item.id === id) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    setCartItems(updatedCartItems);
    updateCart(updatedCartItems);
  };

  // Decrease quantity of a product
  const decreaseQuantity = (id) => {
    const updatedCartItems = cartItems.map(item => {
      if (item.id === id && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });
    setCartItems(updatedCartItems);
    updateCart(updatedCartItems);
  };

  // Remove a product from the cart
  const removeItem = (id) => {
    const updatedCartItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCartItems);
    updateCart(updatedCartItems);
  };

  // Update cart in cookies
  const updateCart = (items) => {
    const cartObject = {};
    items.forEach(item => {
      cartObject[item.id] = item.quantity;
    });
    Cookies.set('cart', JSON.stringify(cartObject), { expires: 7 });
  };

  // Rest of your component code...

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
            {/* Calculate and display total price */}
          </div>
          <div className="action-buttons">
            <Link to="/product" className="back-button">Back to Products</Link>
            <Link to="/checkout" className="checkout-button">Proceed to Checkout</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingCartPage;
