import React from 'react';
import PaymentComponent from './components/PaymentComponent';
import ShippingComponent from './ShipmentComponent';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import { createShipment, createPayment, createOrder } from './api';
import './CheckoutPage.css'; // Import the CSS file for styling

const CheckoutPage = () => {
    const cartItems = [
        { id: 1, name: 'Product 1', price: 10 },
        { id: 2, name: 'Product 2', price: 15 },
        { id: 3, name: 'Product 3', price: 20 }
    ];

    const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);

    return (
        <div className="checkout-page-container">
            <h1 className="page-title">Checkout</h1>
            <div className="section">
                <div className="bubble">
                    <h2 className="section-title">Shipment</h2>
                    <ShippingComponent />
                </div>
            </div>
            <div className="section">
                <div className="bubble">
                    <h2 className="section-title">Payment</h2>
                    <PaymentComponent />
                </div>
            </div>
            <div className="section">
                <div className="bubble">
                    <h2 className="section-title">Cart</h2>
                    <div className="cart-box">
                        <ul className="cart-items">
                            {cartItems.map(item => (
                                <li key={item.id} className="cart-item">
                                    {item.name} - ${item.price}
                                </li>
                            ))}
                        </ul>
                        <div className="total-price">
                            Total: ${totalPrice}
                        </div>
                    </div>
                </div>
            </div>
            <div className="action-buttons">
                <Link to="/product" className="cancel-order-button">Cancel Order</Link>
                <Link to="/shoppingcart" className="back-button">Back to Shopping Cart</Link>
                <Link to="/thank-you" className="submit-button">Submit</Link>
            </div>
        </div>
    );
};

export default CheckoutPage;
