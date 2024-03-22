const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const userController = require('../controllers/userController');

router.post('/register', userController.registerUser);
router.get('/profile', auth, userController.getUserProfile);

module.exports = router;