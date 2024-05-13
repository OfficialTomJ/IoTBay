import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios'; // Import axios for API calls
import { Link } from 'react-router-dom';
import './ShoppingCartPage.css';

const ShoppingCartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [productIdToAdd, setProductIdToAdd] = useState('');

  useEffect(() => {
    const cartString = Cookies.get('cart') || '{}';
    const cart = JSON.parse(cartString);

    if (Object.keys(cart).length === 0) {
      const sampleProducts = [
        { id: '1', name: 'Sample Product 1', price: 10, quantity: 1 },
        { id: '2', name: 'Sample Product 2', price: 10, quantity: 1 },
        { id: '3', name: 'Sample Product 3', price: 10, quantity: 1 },
        { id: '4', name: 'Sample Product 4', price: 10, quantity: 1 },
        { id: '5', name: 'Sample Product 5', price: 10, quantity: 1 }
      ];


      setCartItems(sampleProducts);
      saveCartToCookies(sampleProducts);
    } else {
      const itemsFromCart = Object.keys(cart).map(productId => ({
        id: productId,
        quantity: cart[productId],
        name: `Product ${productId}`,
        price: 10
      }));
      setCartItems(itemsFromCart);
    }
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
    updateCart(id, cartItems.find((item) => item.id === id).quantity + 5);
  };

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

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="shopping-cart-container">
      <h1 className="page-title">Shopping Cart</h1>
      <div className="product-input-container">
        <input
          type="text"
          placeholder="Enter Product ID"
          value={productIdToAdd}
          onChange={(e) => setProductIdToAdd(e.target.value)}
        />
        <button onClick={addProductById} className="add-to-cart-button">Add to Cart</button>
      </div>
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
