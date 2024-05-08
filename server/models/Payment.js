const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    transactionID: {
        type: Number,
        required: true
    },
    userCardNum: {
        type: Number,
        required: true
    },
    userCardExpiry: {
        type: Number,
        required: true
    },
    user_CCV: {
        type: Number,
        required: true
    }
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
