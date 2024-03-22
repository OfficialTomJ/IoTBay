const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

router.post('/login', authController.loginUser);
router.post('/generate-password-token', authController.generatePasswordToken);
router.get('/verify-reset-token/:token', authController.validateResetToken);
router.post('/reset-password', authController.resetPassword);

module.exports = router;