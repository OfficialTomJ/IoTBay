const mongoose = require('mongoose'); //mock database
const bcrypt = require('bcryptjs'); //password hash encryption
const User = require('../models/User');
const sendEmail = require('../utils/mailer');
const UserVerification = require('../models/userVerification');
const {registerUser, registerStaff, deleteAccount, updateUserProfile,} = require('../controllers/userController');
// Use the mocking functionality provided by Jest
jest.mock('../models/User');
jest.mock('../models/AccessLog');
jest.mock('../models/userVerification');
jest.mock('bcryptjs');
jest.mock('../utils/mailer');

describe('User Controller', () => { // //define a test suite,the name is user controller
    let mockRequest; //define the simulation request object
    let mockResponse; // response object
    let mockUser; // user object

    beforeEach(() => {
        mockUser = { id: new mongoose.Types.ObjectId() }; //create a mock user object containing a randomly generated user ID
        mockRequest = { user: mockUser, body: {} }; //create a mock request object, containing an empty request
        mockResponse = { 
          //simulate the status method of the response object and return itself for chain calls and the json and send methods of the response object
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn()
        };

        jest.clearAllMocks(); //Clear all simulated call information
    });

    describe('registerUser', () => {
        it('should register a user and send verification code', async () => { //Define a test case
            mockRequest.body = {
                fullName: 'Test User',
                email: 'test@test.com',
                password: 'password',
                phone: '123456789',
            };

            User.findOne.mockResolvedValue(null); // use the simulation function to simulate the findOne method of the user model and return empty, indicating that the database does not have this information.
            UserVerification.findOne.mockResolvedValue(null); //same, it means there is no verification information
            bcrypt.genSalt.mockResolvedValue('salt'); 
            bcrypt.hash.mockResolvedValue('hashedPassword');  // password hash
            sendEmail.mockResolvedValue(true);//Use a tool function that simulates sending emails. Return true to indicate that the email is sent successfully.
            
            await registerUser(mockRequest, mockResponse);// Call the registered user's function, simulated request and response objects
            // Verify that the registered user function behaves as expected
            expect(User.findOne).toHaveBeenCalledWith({ email: mockRequest.body.email });
            expect(sendEmail).toHaveBeenCalledWith(
                mockRequest.body.email,
                'Please verify your email',
                expect.stringContaining('Your verification code is:')
            );
            expect(mockResponse.json).toHaveBeenCalledWith({
                msg: 'Registration successful, please check your email to complete verification.',
                verificationCode: expect.any(String)
            });
        });

        it('should return 400 if user already exists', async () => { //Define a test case
            mockRequest.body = {
                fullName: 'Test User',
                email: 'test@test.com',
                password: 'password',
                phone: '123456789'
            };

            User.findOne.mockResolvedValue({ email: 'test@test.com' });

            await registerUser(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({ msg: 'User already exists' });
        });
    });

    describe('registerStaff', () => {
        it('should register a staff member', async () => {
            mockRequest.body = {
                fullName: 'Staff Member',
                email: 'staff@test.com',
                password: 'password',
                phone: '123456789'
            };

            User.findOne.mockResolvedValue(null);
            bcrypt.genSalt.mockResolvedValue('salt');
            bcrypt.hash.mockResolvedValue('hashedPassword');

            await registerStaff(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith({ msg: 'Staff registration successful. You can now log in.' });
        });

        it('should return 400 if staff already exists', async () => { 
            mockRequest.body = {
                fullName: 'Staff Member',
                email: 'staff@test.com',
                password: 'password',
                phone: '123456789'
            };

            User.findOne.mockResolvedValue({ email: 'staff@test.com' });

            await registerStaff(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({ msg: 'Staff already exists' });
        });
    });
    
    describe('deleteAccount', () => {
        it('should delete user account', async () => {
            User.findByIdAndDelete.mockResolvedValue(true);

            await deleteAccount(mockRequest, mockResponse);

            expect(mockResponse.json).toHaveBeenCalledWith({ msg: 'Account deleted successfully' });
        });
    });

    describe('updateUserProfile', () => {
        it('should update user profile', async () => {
            mockRequest.body = { fullName: 'Updated User', email: 'updated@test.com', phone: '0987654321' };

            User.findById.mockResolvedValue({
                id: '1',
                fullName: 'Test User',
                email: 'test@test.com',
                phone: '1234567890',
                save: jest.fn()
            });

            await updateUserProfile(mockRequest, mockResponse);

            expect(mockResponse.json).toHaveBeenCalledWith({ msg: 'User profile updated successfully' });
        });

        it('should return 404 if user not found', async () => {
            mockRequest.body = { fullName: 'Updated User', email: 'updated@test.com', phone: '0987654321' };

            User.findById.mockResolvedValue(null);

            await updateUserProfile(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ msg: 'User not found' });
        });
    });
});
