import React, { useState } from 'react';
import { Link } from 'react-router-dom';

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
//design
  return (
    <div className="container mx-auto my-8">
      <h1 className="text-3xl font-bold mb-4">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <div>
          {cartItems.map(item => (
            <div key={item.id} className="flex items-center justify-between border-b border-gray-300 py-2">
              <div>
                <h3 className="text-lg font-medium">{item.name}</h3>
                <p className="text-gray-600">Price: ${item.price}</p>
                <div className="flex items-center">
                  <button onClick={() => decreaseQuantity(item.id)} className="text-gray-500 mr-2">-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQuantity(item.id)} className="text-gray-500 ml-2">+</button>
                </div>
              </div>
              <button onClick={() => removeItem(item.id)} className="text-red-600">Remove</button>
            </div>
          ))}
          <div className="flex justify-between items-center mt-4">
            <h3 className="text-lg font-medium">Total Price: ${totalPrice}</h3>
            <div className="flex items-center space-x-4">
              <Link to="/Product" className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md">Back to Products</Link>
              <Link to="/payment" className="bg-blue-500 text-white px-4 py-2 rounded-md">Proceed to Payment</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingCartPage;

