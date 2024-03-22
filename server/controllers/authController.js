const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AccessLog = require('../models/AccessLog');

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

    try {
        // Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        await AccessLog.create({
            eventType: 'login',
            userId: user._id,
         });

        // Create JWT token
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };
        const jwtSecret = process.env.jwtSecret;

        jwt.sign(
            payload,
            jwtSecret,
            { expiresIn: 3600 }, // 1 hour
            (err, token) => {
                if (err) throw err;
                
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.generatePasswordToken = async (req, res) => {
    const { email } = req.body;
  
    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
        return res.status(404).json({ msg: 'User not found' });
        }

        // Generate a reset password token
        const resetToken = jwt.sign({ email }, process.env.jwtSecret, { expiresIn: '1h' });
        resetLink = `http://localhost:3000/reset-password/${resetToken}`;

        // Send email with reset password link
        // You can use a library like Nodemailer to send emails
        // Include the resetToken in the URL sent in the email

        res.json({ msg: 'Password reset link sent to your email', link: resetLink });
    } catch (error) {
        console.error('Error generating token:', error);
        res.status(500).json({ msg: 'Server Error' });
    }
};

exports.validateResetToken = async (req, res) => {
  const { token } = req.params;

  try {
    // Decode and verify the token
    const decodedToken = jwt.verify(token, process.env.jwtSecret);

    // Extract email from the decoded token
    const { email } = decodedToken;

    // Check if the user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // If user exists and token is valid, send success response
    res.json({ msg: 'Token is valid', email, isValid: true });
  } catch (error) {
    console.error('Error validating reset password token:', error);
    res.status(400).json({ msg: 'Invalid token' });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Verify the reset token
    const decodedToken = jwt.verify(token, process.env.jwtSecret);

    // Check if the token is valid and not expired
    if (!decodedToken || !decodedToken.email) {
      return res.status(400).json({ msg: 'Invalid or expired reset token' });
    }

    // Find the user by email and update the password
    const user = await User.findOne({ email: decodedToken.email });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Update the user's password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    // Send response
    res.json({ msg: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ msg: 'Server Error' });
  }
};