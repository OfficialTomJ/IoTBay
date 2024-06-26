const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const userController = require('../controllers/userController');

router.post('/register', userController.registerUser);
router.post('/register-staff', userController.registerStaff);
router.get('/profile', auth, userController.getUserProfile);
router.delete('/', auth, userController.deleteAccount);
router.put('/profile', auth, userController.updateUserProfile);
router.get('/logs', auth, userController.getUserLogs);
router.post('/verify-email', userController.verifyEmail);
router.post('/resend-verification-code', userController.resendVerificationCode);

module.exports = router;