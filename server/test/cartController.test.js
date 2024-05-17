const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { addToCart, updateCart, removeFromCart } = require('../controllers/cartController');
const Order = require('../models/Order');

const app = express();

app.use(express.json());
app.post('/cart/add', addToCart);
app.put('/cart/update/:productId', updateCart);
app.delete('/cart/remove/:productId', removeFromCart);

jest.mock('../models/Order');

describe('Cart Controller', () => {
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    mockRequest = { body: {}, params: {}, user: { id: new mongoose.Types.ObjectId() } };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('addToCart', () => {
    it('should handle missing productId or quantity in request body', async () => {
      mockRequest.body = {};
      
      await addToCart(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'ProductId and quantity are required' });
    });

    it('should handle errors when saving to the database', async () => {
      mockRequest.body = { productId: '1', quantity: 1 };
      Order.findOne.mockRejectedValueOnce(new Error('Error saving order'));

      await addToCart(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Failed to add item to cart' });
    });
  });

  describe('updateCart', () => {
    it('should handle missing productId in request params', async () => {
      mockRequest.params = {};

      await updateCart(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'ProductId is required' });
    });

    it('should handle errors when finding order in the database', async () => {
      mockRequest.params.productId = '1';
      Order.findOne.mockRejectedValueOnce(new Error('Error finding order'));

      await updateCart(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Failed to update cart' });
    });
  });

  describe('removeFromCart', () => {
    it('should handle missing productId in request params', async () => {
      mockRequest.params = {};

      await removeFromCart(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'ProductId is required' });
    });

    it('should handle errors when deleting order from the database', async () => {
      mockRequest.params.productId = '1';
      Order.findOneAndDelete.mockRejectedValueOnce(new Error('Error deleting order'));

      await removeFromCart(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Failed to remove item from cart' });
    });
  });
});
