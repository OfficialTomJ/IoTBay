const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');

router.post('/register', adminController.adminRegister);
router.get('/profile', adminController.getUserProfile);
router.delete('/profile/:id', adminController.deleteAccount);
router.put('/profile', adminController.updateUserProfile);
router.get('/logs', adminController.getUserLogs);
router.put('/profile/:id', adminController.updateUserProfile);
module.exports = router;

