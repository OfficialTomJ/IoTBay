import React, { useState, useEffect } from 'react';
import PaymentComponent from './components/PaymentComponent';
import ShippingComponent from './ShipmentComponent';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './CheckoutPage.css'; // Import the CSS file for styling

const CheckoutPage = () => {
    const [shippingAddress, setShippingAddress] = useState('');
    const [paymentDetails, setPaymentDetails] = useState('');
    const [cartItems, setCartItems] = useState([]);
    const [totalCost, setTotalCost] = useState(0); // State to hold total cost
    const [error, setError] = useState(null);

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

                // Calculate total cost
                const cost = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
                setTotalCost(cost);
            } catch (error) {
                setError('Error fetching cart items');
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
            // Display success message to the user
            alert('Your order has been submitted successfully!');
            // Redirect to success/thank you page or perform other actions
        } catch (error) {
            setError('Error during checkout'); // Set error if there's an issue during checkout
            // Display error message to the user
            alert('There was an error while processing your order. Please try again later.');
        }
    };
    
    

    const handleQuantityChange = (itemId, newQuantity) => {
        const updatedCartItems = cartItems.map(item =>
            item.id === itemId ? { ...item, quantity: newQuantity } : item
        );
        setCartItems(updatedCartItems);

        // Recalculate total cost
        const cost = updatedCartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setTotalCost(cost);
    };

    return (
        <div className="checkout-page-container">
            <h1 className="page-title">Checkout</h1>
            <div className="section">
                <div className="bubble">
                    <h2 className="section-title">Shipment</h2>
                    <ShippingComponent
                        value={shippingAddress}
                        onChange={e => setShippingAddress(e.target.value)}
                    />
                </div>
            </div>
            <div className="section">
                <div className="bubble">
                    <h2 className="section-title">Payment</h2>
                    <PaymentComponent
                        value={paymentDetails}
                        onChange={e => setPaymentDetails(e.target.value)}
                    />
                </div>
            </div>
            <div className="section">
                <div className="bubble">
                    <h2 className="section-title">Cart</h2>
                    <div className="cart-box">
                        <ul className="cart-items">
                            {cartItems.map(item => (
                                <li key={item.id} className="cart-item">
                                    {item.name} - ${item.price} - Quantity: 
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        onChange={e => handleQuantityChange(item.id, parseInt(e.target.value))}
                                        min="1"
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                    <p>Total Cost: ${totalCost}</p> {/* Display total cost */}
                </div>
            </div>
            {error && <div className="error-message">{error}</div>}
            <div className="action-buttons">
                <Link to="/shoppingcart" className="back-button">Back to Shopping Cart</Link>
                <button className="submit-button" onClick={handleCheckout}>Checkout</button>

            </div>
        </div>
    );
};

export default CheckoutPage;
