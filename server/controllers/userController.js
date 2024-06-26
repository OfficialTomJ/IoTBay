const User = require('../models/User');
const AccessLog = require('../models/AccessLog');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/mailer');
const UserVerification = require('../models/userVerification');

// Use global variables to store unverified user data, suitable for examples and development environments
global.tempUsers = {};

// Function to generate 6-digit verification code
function generateVerificationCode() {
    return Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join('');
}

// @route   POST api/users/register
// @desc    Register new user and send verification code
// @access  Public
exports.registerUser = async (req, res) => {
    const { fullName, email, password, phone } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        // Check for existing unverified user information
        let tempUser = await UserVerification.findOne({ email });
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const emailVerificationCode = generateVerificationCode();

        if (tempUser) {
            // If it already exists, update the verification code and expiration time
            tempUser.emailVerificationCode = emailVerificationCode;
            tempUser.expireTime = new Date(Date.now() + 3600000); //Update expiration time 60min
            await tempUser.save();
        } else {
            tempUser = new UserVerification({
                fullName,
                email,
                hashedPassword,
                phone,
                emailVerificationCode,
                expireTime: new Date(Date.now() + 3600000)//set time 60min
            });
            await tempUser.save();
        }
        await sendEmail(
            email,
            'Please verify your email',
            `Your verification code is: ${emailVerificationCode}. Please complete verification within an hour.`
        );
        res.json({ msg: 'Registration successful, please check your email to complete verification.', verificationCode: emailVerificationCode });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.registerStaff = async (req, res) => {
    const { fullName, email, password, phone } = req.body;

    try { // Check if the user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'Staff already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({   //Create a new user record
            fullName,
            email,
            password: hashedPassword,
            phone,
            role: 'Staff' //The default role is Staff
        });

        await user.save();

        res.status(201).json({ msg: 'Staff registration successful. You can now log in.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// @route   POST api/users/verify-email
// @desc    Verify user's email with the code sent to their email
// @access  Public
exports.verifyEmail = async (req, res) => {
    const { email, code } = req.body;

    try {
        // Fetch the temporary user data from MongoDB
        const tempUser = await UserVerification.findOne({ email: email });
        console.log(email);
        if (!tempUser || tempUser.emailVerificationCode !== code || tempUser.expireTime < Date.now()) {
            return res.status(400).json({ msg: 'Invalid verification code or verification code has expired' });
        }

        // Create a new user as the email is now verified
        let user = new User({
            fullName: tempUser.fullName,
            email: tempUser.email,
            password: tempUser.hashedPassword,
            phone: tempUser.phone
        });
        await user.save();

        // Record the account creation event in the AccessLog
        await AccessLog.create({
        eventType: 'account_created',
        userId: user._id
        });

        // Clean up the temporary data
        await UserVerification.deleteOne({ email: email });

        res.json({ msg: 'Email verification is successful and the account has been created.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getUserProfile = async (req, res) => {
    try {
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
    try {
        let user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const { fullName, email, phone } = req.body;
        if (fullName) user.fullName = fullName;
        if (email) user.email = email;
        if (phone) user.phone = phone;
        await user.save();

        res.json({ msg: 'User profile updated successfully' });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ msg: 'Server Error' });
    }
};

exports.getUserLogs = async (req, res) => {
    try {
    // Assuming you have a way to identify the current user, e.g., through req.user
    const userId = req.user.id;
  
    // Fetch user logs from the database based on userId
    const userLogs = await AccessLog.find({ userId });
  
    res.json({ userLogs });
} catch (error) {
    console.error('Error fetching user logs:', error);
    res.status(500).json({ error: 'Server error' });
}
};

// @route   POST api/users/resend-verification-code
// @desc    Resend a new verification code to the user's email
// @access  Public
exports.resendVerificationCode = async (req, res) => {
    const { email } = req.body;
    try { // check Userinformation
        let tempUser = await UserVerification.findOne({ email });

        if (!tempUser) {
            return res.status(400).json({ msg: 'User not found' });
        }
        // Generate new verification code and expiration time
        const newVerificationCode = generateVerificationCode();
        const newExpireTime = new Date(Date.now() + 3600000); //Expires in 60 minutes
        tempUser.emailVerificationCode = newVerificationCode;//Update the verification code information in the database
        tempUser.expireTime = newExpireTime;
        await tempUser.save()
        // Send new verification code to user email
        await sendEmail(
            email,
            'Your new verification code',
            `Your new verification code is: ${newVerificationCode}. Please complete verification within an hour.`
        );
        res.json({ msg: 'New verification code has been sent successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

