const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

router.post('/login', authController.loginUser);
router.post('/reset-password', authController.resetPassword);
router.get('/verify-reset-token/:token', authController.validateResetToken);

module.exports = router;