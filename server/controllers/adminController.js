const User = require('../models/User');
const AccessLog = require('../models/AccessLog');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

exports.adminRegister = async (req, res) => {
  const { fullName, email, password, phone, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      fullName,
      email,
      password,
      phone,
      role
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.json({ msg: 'Admin registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getUserProfile = async (req, res) => {
  const { name, phone } = req.query;

  if (!name || !phone) {
    return res.status(400).json({ msg: 'Name and phone number are required' });
  }

  try {
    const user = await User.findOne({ fullName: name, phone }).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'User not found with the provided name and phone number' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ msg: 'Server Error' });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.json({ msg: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ msg: 'Server Error' });
  }
};

exports.updateUserProfile = async (req, res) => {
  const { fullName, email, phone, role } = req.body;
  const userId = req.params.userId;

  console.log(`Updating user profile for ID: ${userId}`);

  try {
    let user = await User.findById(userId);
    if (!user) {
      console.log(`User not found for ID: ${userId}`);
      return res.status(404).json({ msg: 'User not found' });
    }

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.role = role || user.role;

    await user.save();

    res.json({ msg: 'User profile updated successfully', user });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ msg: 'Server Error' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('fullName email phone role');
    res.json(users);
  } catch (error) {
    console.error('Failed to retrieve users:', error);
    res.status(500).json({ msg: 'Server Error' });
  }
};

exports.getUserLogs = async (req, res) => {
  const userId = req.params.userId;
  console.log('Requested user ID:', userId);

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ msg: 'Invalid user ID format' });
  }

  try {
    const logs = await AccessLog.find({ userId: new mongoose.Types.ObjectId(userId) });
    console.log('Logs:', logs);

    if (!logs.length) {
      return res.status(404).json({ msg: 'No logs found for this user' });
    }

    res.json(logs);
  } catch (error) {
    console.error('Error retrieving user logs:', error.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

exports.toggleUserStatus = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.role = user.role === 'Deactivated' ? 'User' : 'Deactivated';
    await user.save();

    res.json(user);
  } catch (error) {
    console.error('Error toggling user status:', error);
    res.status(500).json({ msg: 'Server Error' });
  }
};
