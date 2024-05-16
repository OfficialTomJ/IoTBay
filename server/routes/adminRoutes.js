const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/register', adminController.adminRegister);
router.get('/profile', adminController.getUserProfile);
router.delete('/profile/:userId', adminController.deleteAccount);
router.put('/profile/:userId', adminController.updateUserProfile);
router.get('/logs/:userId', adminController.getUserLogs);
router.get('/users', adminController.getAllUsers);
router.put('/profile/:userId/toggleStatus', adminController.toggleUserStatus);

module.exports = router;
