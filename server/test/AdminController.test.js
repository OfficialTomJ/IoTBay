const request = require('supertest');
const express = require('express');
const bcrypt = require('bcryptjs');
const { adminRegister, deleteAccount, getUserProfile, updateUserProfile, getAllUsers, getUserLogs, toggleUserStatus } = require('../controllers/adminController');
const User = require('../models/User');
const AccessLog = require('../models/AccessLog');
const app = express();

app.use(express.json());
app.post('/register', adminRegister);
app.get('/profile', getUserProfile);
app.delete('/account/:userId', deleteAccount);
app.put('/profile/:userId', updateUserProfile);
app.get('/users', getAllUsers);
app.get('/logs/:userId', getUserLogs);
app.put('/toggle-status/:userId', toggleUserStatus);

jest.mock('../models/User', () => {
  const actual = jest.requireActual('../models/User');
  const mockUser = {
    findOne: jest.fn().mockReturnThis(),
    find: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    save: jest.fn(),
    findById: jest.fn().mockReturnThis(),
    findByIdAndDelete: jest.fn(),
  };
  return {
    ...actual,
    ...mockUser,
    mockImplementation: jest.fn().mockImplementation(() => mockUser),
  };
});

jest.mock('../models/AccessLog', () => {
  return {
    find: jest.fn(),
  };
});


describe('adminRegister', () => {
  it('should return error if user already exists', async () => {
    User.findOne.mockResolvedValue({});

    const res = await request(app)
      .post('/register')
      .send({
        fullName: 'Admin User',
        email: 'admin@user.com',
        password: 'password',
        phone: '112233',
        role: 'Admin',
      });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ msg: 'User already exists' });
  });


  it('should handle server errors', async () => {
    User.findOne.mockRejectedValue(new Error('Server error'));

    const res = await request(app)
      .post('/register')
      .send({
        fullName: 'Admin User',
        email: 'admin@user.com',
        password: 'password',
        phone: '112233',
        role: 'Admin',
      });

    expect(res.status).toBe(500);
    expect(res.text).toBe('Server Error');
  });
});

  describe('getUserProfile', () => {
    it('should return error if name or phone is missing', async () => {
      const res = await request(app).get('/profile');
  
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ msg: 'Name and phone number are required' });
    });
  
    it('should return user profile if found', async () => {
      const mockUser = {
        fullName: 'Admin User',
        email: 'admin@user.com',
        phone: '112233',
      };
  
      User.findOne.mockImplementation(() => ({
        select: jest.fn().mockResolvedValue(mockUser),
      }));
  
      const res = await request(app).get('/profile').query({ name: 'Admin User', phone: '112233' });
  
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ user: mockUser });
    });
  
    it('should return error if user not found', async () => {
      User.findOne.mockImplementation(() => ({
        select: jest.fn().mockResolvedValue(null),
      }));
  
      const res = await request(app).get('/profile').query({ name: 'Admin User', phone: '112233' });
  
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ msg: 'User not found with the provided name and phone number' });
    });
  
    it('should handle server errors', async () => {
      User.findOne.mockImplementation(() => ({
        select: jest.fn().mockRejectedValue(new Error('Server error')),
      }));
  
      const res = await request(app).get('/profile').query({ name: 'Admin User', phone: '112233' });
  
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ msg: 'Server Error' });
    });
  });
  
  describe('deleteAccount', () => {
    it('should delete user account successfully', async () => {
      User.findByIdAndDelete.mockResolvedValue(true);
  
      const res = await request(app).delete('/account/609c5d2d3f8b4e3b4c8b4567');
  
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ msg: 'Account deleted successfully' });
    });
  
    it('should handle server errors', async () => {
      User.findByIdAndDelete.mockRejectedValue(new Error('Server error'));
  
      const res = await request(app).delete('/account/609c5d2d3f8b4e3b4c8b4567');
  
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ msg: 'Server Error' });
    });
  });

describe('updateUserProfile', () => {
  it('should update user profile successfully', async () => {
    const mockUser = {
      save: jest.fn().mockResolvedValue(true),
      fullName: 'User',
      email: 'user@user.com',
      phone: '11223344',
      role: 'User',
    };

    User.findById.mockResolvedValue(mockUser);

    const res = await request(app)
      .put('/profile/609c5d2d3f8b4e3b4c8b4567')
      .send({
        fullName: 'Staff',
        email: 'staff@user.com',
        phone: '1122334455',
        role: 'Staff',
      });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      msg: 'User profile updated successfully',
      user: {
        fullName: 'Staff',
        email: 'staff@user.com',
        phone: '1122334455',
        role: 'Staff',
      },
    });
  });

  it('should return error if user not found', async () => {
    User.findById.mockResolvedValue(null);

    const res = await request(app)
      .put('/profile/609c5d2d3f8b4e3b4c8b4567')
      .send({
        fullName: 'Admin User',
        email: 'admin@user.com',
        phone: '112233',
        role: 'Admin',
      });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ msg: 'User not found' });
  });

  it('should handle server errors', async () => {
    User.findById.mockRejectedValue(new Error('Server error'));

    const res = await request(app)
      .put('/profile/609c5d2d3f8b4e3b4c8b4567')
      .send({
        fullName: 'Admin User',
        email: 'admin@user.com',
        phone: '112233',
        role: 'Admin',
      });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ msg: 'Server Error' });
  });
});

describe('getAllUsers', () => {
  it('should retrieve all users successfully', async () => {
    const mockUsers = [
      { fullName: 'Admin User', email: 'admin@user.com', phone: '112233', role: 'Admin' },
      { fullName: 'User', email: 'user@user.com', phone: '11223344', role: 'User' },
    ];

    User.find.mockImplementation(() => ({
      select: jest.fn().mockResolvedValue(mockUsers),
    }));

    const res = await request(app).get('/users');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockUsers);
  });

  it('should handle server errors', async () => {
    User.find.mockImplementation(() => ({
      select: jest.fn().mockRejectedValue(new Error('Server error')),
    }));

    const res = await request(app).get('/users');

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ msg: 'Server Error' });
  });
});


describe('getUserLogs', () => {
  it('should return error for invalid user ID format', async () => {
    const res = await request(app).get('/logs/invalidID');

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ msg: 'Invalid user ID format' });
  });

  it('should retrieve user logs successfully', async () => {
    const mockLogs = [
      { action: 'Login', timestamp: new Date().toISOString() },
      { action: 'Logout', timestamp: new Date().toISOString() },
    ];

    AccessLog.find.mockResolvedValue(mockLogs);

    const res = await request(app).get('/logs/609c5d2d3f8b4e3b4c8b4567');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockLogs);
  });

  it('should return error if no logs found', async () => {
    AccessLog.find.mockResolvedValue([]);

    const res = await request(app).get('/logs/609c5d2d3f8b4e3b4c8b4567');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ msg: 'No logs found for this user' });
  });

  it('should handle server errors', async () => {
    AccessLog.find.mockRejectedValue(new Error('Server error'));

    const res = await request(app).get('/logs/609c5d2d3f8b4e3b4c8b4567');

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ msg: 'Server Error' });
  });
});

describe('toggleUserStatus', () => {
  it('should toggle user status successfully', async () => {
    const mockUser = {
      _id: '609c5d2d3f8b4e3b4c8b4567',
      role: 'User',
      save: jest.fn().mockResolvedValue(true),
    };

    User.findById.mockResolvedValue(mockUser);

    const res = await request(app).put('/toggle-status/609c5d2d3f8b4e3b4c8b4567');

    expect(res.status).toBe(200);
    expect(res.body.role).toBe('Deactivated');
  });

  it('should return error if user not found', async () => {
    User.findById.mockResolvedValue(null);

    const res = await request(app).put('/toggle-status/609c5d2d3f8b4e3b4c8b4567');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ msg: 'User not found' });
  });

  it('should handle server errors', async () => {
    User.findById.mockRejectedValue(new Error('Server error'));

    const res = await request(app).put('/toggle-status/609c5d2d3f8b4e3b4c8b4567');

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ msg: 'Server Error' });
  });
});
