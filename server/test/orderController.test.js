const {
    createOrder,
    getOrdersForUser,
    getOrderById,
    cancelOrder,
    checkout,
  } = require('../controllers/orderController');
  const Order = require('../models/Order');
  const AccessLog = require('../models/AccessLog');
  const Shipment = require('../models/Shipment');
  const Payment = require('../models/Payment');
  
  jest.mock('../models/Order');
  jest.mock('../models/AccessLog');
  jest.mock('../models/Shipment');
  jest.mock('../models/Payment');
  
  describe('Order Controller', () => {
    let mockRequest;
    let mockResponse;
  
    beforeEach(() => {
      mockRequest = { body: {}, params: {}, user: { id: 'userId' } };
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
      };
    });
  
    describe('createOrder', () => {
      it('should handle errors when creating order', async () => {
        const error = new Error('Error creating order');
        Order.mockImplementationOnce(() => {
          throw error;
        });
  
        await createOrder(mockRequest, mockResponse);
  
        expect(console.error).toHaveBeenCalledWith('Error creating order:', error);
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Failed to create order' });
      });
    });
  
    describe('getOrdersForUser', () => {
      it('should handle errors when fetching orders for user', async () => {
        const error = new Error('Error fetching orders for user');
        Order.find.mockRejectedValueOnce(error);
  
        await getOrdersForUser(mockRequest, mockResponse);
  
        expect(console.error).toHaveBeenCalledWith('Error fetching orders for user:', error);
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Failed to fetch orders for user' });
      });
    });
  
    describe('getOrderById', () => {
      it('should handle errors when fetching order by ID', async () => {
        const error = new Error('Error fetching order by ID');
        Order.findOne.mockRejectedValueOnce(error);
  
        await getOrderById(mockRequest, mockResponse);
  
        expect(console.error).toHaveBeenCalledWith('Error fetching order by ID:', error);
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Failed to fetch order by ID' });
      });
  
      it('should handle order not found', async () => {
        Order.findOne.mockResolvedValueOnce(null);
  
        await getOrderById(mockRequest, mockResponse);
  
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Order not found' });
      });
    });
  
    describe('cancelOrder', () => {
      it('should handle errors when deleting order', async () => {
        const error = new Error('Error deleting order');
        Order.findOneAndDelete.mockRejectedValueOnce(error);
  
        await cancelOrder(mockRequest, mockResponse);
  
        expect(console.error).toHaveBeenCalledWith('Error deleting order:', error);
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Failed to delete order' });
      });
  
      it('should handle order not found or unauthorized', async () => {
        Order.findOneAndDelete.mockResolvedValueOnce(null);
  
        await cancelOrder(mockRequest, mockResponse);
  
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Order not found or unauthorized' });
      });
    });
  
    describe('checkout', () => {
      it('should handle errors during checkout process', async () => {
        const error = new Error('Error handling checkout');
        Order.mockImplementationOnce(() => {
          throw error;
        });
  
        await checkout(mockRequest, mockResponse);
  
        expect(console.error).toHaveBeenCalledWith('Error handling checkout:', error);
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Failed to handle checkout process' });
      });
    });
  });
  