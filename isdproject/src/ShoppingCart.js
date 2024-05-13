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
    const updatedCartItems = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
    );
    setCartItems(updatedCartItems);
    updateCart(id, Math.max(1, cartItems.find((item) => item.id === id).quantity - 1));
  };

  const increaseQuantity = (id) => {
    const updatedCartItems = cartItems.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updatedCartItems);
  };

  const removeItem = (id) => {
    removeFromCart(id);
    const updatedCartItems = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCartItems);
    updateCart(updatedCartItems);
  };

  const updateCart = (items) => {
    const cartObject = {};
    items.forEach(item => {
      cartObject[item.id] = item.quantity;
    });
    Cookies.set('cart', JSON.stringify(cartObject), { expires: 7 });
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

  const removeFromCart = (productId) => {
    const cartString = Cookies.get('cart') || '{}';
    let cart = JSON.parse(cartString);
    delete cart[productId];
    Cookies.set('cart', JSON.stringify(cart), { expires: 7 });
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
