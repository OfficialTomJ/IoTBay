const User = require('../models/User');
const AccessLog = require('../models/AccessLog');
const bcrypt = require('bcryptjs');

const postmark = require("postmark");

const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY);

// @route   POST api/users/register
// @desc    Register new user
// @access  Public
exports.registerUser = async (req, res) => {
  // Logic for user registration
  const { username, email, password } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Create new user
        user = new User({
            username,
            email,
            password
        });

        // Encrypt password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Save user to database
        await user.save();

        try {
          if (process.env.ENABLE_EMAILS === 'true') {
            await client.sendEmail({
              "From": "hi@thomas-johnston.com",
              "To": "hi@thomas-johnston.com",
              "Subject": "Hello from Postmark",
              "HtmlBody": "<strong>Hello</strong> dear Postmark user.",
              "TextBody": "Hello from Postmark!",
              "MessageStream": "outbound"
            });
            console.log('Welcome email sent successfully');
          }
        } catch (error) {
          console.error('Error sending welcome email:', error);
        }
        

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