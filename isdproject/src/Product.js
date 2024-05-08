// ProductPage.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/product';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(API_URL);
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Error fetching products. Please try again later.');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!name || !price) {
      setError('Please fill in all fields.');
      return;
    }
    try {
      await axios.post(API_URL, { name, price });
      fetchProducts();
      setName('');
      setPrice('');
      setError('');
    } catch (error) {
      console.error('Error adding product:', error);
      setError('Error adding product. Please try again later.');
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`${API_URL}/${productId}`);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Error deleting product. Please try again later.');
    }
  };

  return (
    <div>
      <h1>Product Management</h1>
      <form onSubmit={handleAddProduct}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
        <button type="submit">Add Product</button>
      </form>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <h2>Product List</h2>
      <ul>
        {products.map((product) => (
          <li key={product._id}>
            {product.name} - ${product.price}
            <button onClick={() => handleDeleteProduct(product._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductPage;
