// cartController.test.js

const request = require('supertest');
const app = require('../app'); // Assuming the Express app is exported from this module
const mongoose = require('mongoose');
const CartItem = require('../models/CartItem'); // Assuming CartItem model is defined in this path

describe('Cart Controller', () => {

  beforeAll(async () => {
    // Connect to a test database
    const url = `mongodb://127.0.0.1/test_cart_db`;
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    // Clean up database and close connection
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  describe('Add Item to Cart', () => {
    it('should add a new item to the cart', async () => {
      const newItem = {
        productId: 'product123',
        quantity: 2,
      };

      const response = await request(app)
        .post('/api/cart')
        .send(newItem)
        .expect(201);

      expect(response.body).toHaveProperty('_id');
      expect(response.body.productId).toBe(newItem.productId);
      expect(response.body.quantity).toBe(newItem.quantity);
    });

    it('should return 400 if productId is missing', async () => {
      const newItem = {
        quantity: 2,
      };

      const response = await request(app)
        .post('/api/cart')
        .send(newItem)
        .expect(400);

      expect(response.body).toHaveProperty('msg', 'Product ID is required');
    });
  });

  describe('Update Cart Item', () => {
    let cartItemId;

    beforeAll(async () => {
      const cartItem = new CartItem({
        productId: 'product123',
        quantity: 1,
      });
      const savedCartItem = await cartItem.save();
      cartItemId = savedCartItem._id;
    });

    it('should update the quantity of a cart item', async () => {
      const updatedQuantity = {
        quantity: 3,
      };

      const response = await request(app)
        .put(`/api/cart/${cartItemId}`)
        .send(updatedQuantity)
        .expect(200);

      expect(response.body.quantity).toBe(updatedQuantity.quantity);
    });

    it('should return 400 if quantity is less than 1', async () => {
      const updatedQuantity = {
        quantity: 0,
      };

      const response = await request(app)
        .put(`/api/cart/${cartItemId}`)
        .send(updatedQuantity)
        .expect(400);

      expect(response.body).toHaveProperty('msg', 'Quantity must be at least 1');
    });
  });

  describe('Remove Item from Cart', () => {
    let cartItemId;

    beforeAll(async () => {
      const cartItem = new CartItem({
        productId: 'product123',
        quantity: 1,
      });
      const savedCartItem = await cartItem.save();
      cartItemId = savedCartItem._id;
    });

    it('should remove an item from the cart', async () => {
      await request(app)
        .delete(`/api/cart/${cartItemId}`)
        .expect(204);

      const deletedCartItem = await CartItem.findById(cartItemId);
      expect(deletedCartItem).toBeNull();
    });
  });

  describe('Retrieve Cart', () => {
    it('should retrieve all items in the cart', async () => {
      const response = await request(app)
        .get('/api/cart')
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
    });
  });

});

