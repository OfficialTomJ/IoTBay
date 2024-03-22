const User = require('../models/User');
const AccessLog = require('../models/AccessLog');
const bcrypt = require('bcryptjs');
// @route   POST api/users/register
// @desc    Register new user
// @access  Public
exports.registerUser = async (req, res) => {
  // Logic for user registration
  const { fullName, email, password, phone } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Create new user
        user = new User({
            fullName,
            email,
            password,
            phone
        });

        // Encrypt password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Save user to database
        await user.save();

        await AccessLog.create({
          eventType: 'account_created',
          userId: user._id,
        });

        res.json({ msg: 'User registered successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getUserProfile = async (req, res) => {
  // Logic for retrieving user profile
  try {
    // Fetch user profile based on user ID stored in req.user.id from auth middleware
    const user = await User.findById(req.user.id).select('-password');
    res.json({ user });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ msg: 'Server Error' });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ msg: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ msg: 'Server Error' });
  }
};

exports.updateUserProfile = async (req, res) => {
  const { fullName, email, phone } = req.body;
  const userId = req.user.id;

  try {
    // Find the user by ID
    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Update user profile fields
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (phone) user.phone = phone;

    // Save the updated user profile
    await user.save();

    res.json({ msg: 'User profile updated successfully' });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ msg: 'Server Error' });
  }
};