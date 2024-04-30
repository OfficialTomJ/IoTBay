const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    ccNumber: {
        type: String,
        required: true
    },
    expiry: {
        type: String,
        required: true
    },
    cvc: {
        type: String,
        required: true
    }
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
