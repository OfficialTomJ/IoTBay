import React from 'react';
import PaymentComponent from './components/PaymentComponent';

const CheckoutPage = () => {
    const cartItems = [
        { id: 1, name: 'Product 1', price: 10 },
        { id: 2, name: 'Product 2', price: 15 },
        { id: 3, name: 'Product 3', price: 20 }
    ];

    const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ flex: 1, marginRight: '20px' }}>
                <h2>Shipping</h2>
                {/* Shipping component */}
                {/* Input fields for shipping address, etc. */}
            </div>
            <div style={{ flex: 1, marginRight: '20px' }}>
                <h2>Payment</h2>
                <PaymentComponent/>
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ border: '1px solid #eaeaea', borderRadius: '5px', padding: '20px' }}>
                    <h2>Cart</h2>
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {/* Render cart items */}
                        {cartItems.map(item => (
                            <li key={item.id}>
                                {item.name} - ${item.price}
                            </li>
                        ))}
                    </ul>
                    <div style={{ marginTop: '20px', fontWeight: 'bold' }}>
                        Total: ${totalPrice}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
