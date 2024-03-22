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