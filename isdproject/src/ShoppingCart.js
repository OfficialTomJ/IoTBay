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
    const updatedCartItems = cartItems.map(item => {
      if (item.id === id) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    setCartItems(updatedCartItems);
    updateCart(updatedCartItems);
  };

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

  const removeItem = (id) => {
    const updatedCartItems = cartItems.filter(item => item.id !== id);
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
            <h3>Total Price: ${totalPrice.toFixed(2)}</h3>
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
