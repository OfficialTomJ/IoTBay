const mongoose = require('mongoose');

const userVerificationSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    phone: { type: String, required: true },
    emailVerificationCode: { type: String, required: true },
    expireTime: { type: Date, required: true }
});

const UserVerification = mongoose.model('UserVerification', userVerificationSchema);

module.exports = UserVerification;
