import React, { useState, useEffect } from 'react';
import PaymentComponent from './components/PaymentComponent';
import ShippingComponent from './ShipmentComponent';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie'; // Import Cookies for managing cookies
import { createShipment, createPayment, createOrder } from './api'; // Import API functions
import './CheckoutPage.css';

const CheckoutPage = () => {
    const [shippingAddress, setShippingAddress] = useState('');
    const [paymentDetails, setPaymentDetails] = useState('');
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState(null); // State for error handling

    useEffect(() => {
        const fetchCartItems = () => {
            try {
                const cart = Cookies.get('cart') ? JSON.parse(Cookies.get('cart')) : {};
                const productIds = Object.keys(cart);

                const items = productIds.map(productId => ({
                    id: productId,
                    name: `Product ${productId}`,
                    price: 10, // Assuming a fixed price for each product for demonstration
                    quantity: cart[productId]
                }));

                setCartItems(items);
            } catch (error) {
                setError('Error fetching cart items'); // Set error if there's an issue fetching cart items
            }
        };

        fetchCartItems();
    }, []);

    const handleCheckout = async () => {
        try {
            // Create shipment
            const shipmentId = await createShipment();
            // Create payment
            const paymentId = await createPayment();
            // Construct order data
            const products = cartItems.map(item => item.id);
            const quantities = cartItems.map(item => item.quantity);
            const orderData = {
                products,
                quantities,
                shipmentId,
                paymentId,
            };
            // Create order
            const orderResponse = await createOrder(orderData);
            console.log('Order created:', orderResponse);
            // Clear cart cookie
            Cookies.remove('cart');
            // Redirect to success/thank you page or perform other actions
        } catch (error) {
            setError('Error during checkout'); // Set error if there's an issue during checkout
        }
    };

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
                                    {item.name} - ${item.price} - Quantity: {item.quantity}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            {error && <div className="error-message">{error}</div>} {/* Display error message if error state is set */}
            <div className="action-buttons">
                <Link to="/shoppingcart" className="back-button">Back to Shopping Cart</Link>
                <button className="submit-button" onClick={handleCheckout}>Checkout</button> {/* Change Link to button for checkout */}
            </div>
        </div>
    );
};

export default CheckoutPage;
