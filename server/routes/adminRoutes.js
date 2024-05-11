const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');

router.post('/register', adminController.adminRegister);
router.get('/profile', adminController.getUserProfile);
router.delete('/', adminController.deleteAccount);
router.put('/profile', adminController.updateUserProfile);
router.get('/logs', adminController.getUserLogs);

module.exports = router;

