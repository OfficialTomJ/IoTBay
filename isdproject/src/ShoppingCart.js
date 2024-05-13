import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios'; // Import axios for API calls
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
    console.error('This should be run in /Checkout.js');
  }, []);

  useEffect(() => {
    console.error('This should be run in /Checkout.js');
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

  // Remove a product from the cart
  const removeItem = (id) => {
    const updatedCartItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCartItems);
  };

  const updateCart = (productId, quantity) => {
    const cart = Cookies.get('cart') || '{}';
    let cartObject = {};
    try {
      cartObject = JSON.parse(cart);
    } catch (error) {
      console.error('Error parsing cart JSON:', error);
    }
    cartObject[productId] = quantity;
    Cookies.set('cart', JSON.stringify(cartObject), { expires: 7 });
  };

  // Rest of your component code...

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
