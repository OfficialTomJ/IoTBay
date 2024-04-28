const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const userController = require('../controllers/userController');

// 注册用户
router.post('/register', userController.registerUser);

// 获取用户个人资料，需要认证
router.get('/profile', auth, userController.getUserProfile);

// 删除账户，需要认证
router.delete('/', auth, userController.deleteAccount);

// 更新用户个人资料，需要认证
router.put('/profile', auth, userController.updateUserProfile);

// 获取用户日志，需要认证
router.get('/logs', auth, userController.getUserLogs);

// 验证电子邮件
router.post('/verify-email', userController.verifyEmail);

module.exports = router;
