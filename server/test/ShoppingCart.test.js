// ShoppingCart.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ShoppingCartPage from '../components/ShoppingCartPage';

test('adds a product to the cart', async () => {
  render(<ShoppingCartPage />);
  const productIdInput = screen.getByPlaceholderText('Enter Product ID');
  fireEvent.change(productIdInput, { target: { value: '6' } });
  const addToCartButton = screen.getByText('Add to Cart');
  fireEvent.click(addToCartButton);
  // Add assertions as needed
});
