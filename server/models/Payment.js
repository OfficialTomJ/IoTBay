const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    transactionId: {
        type: Number,

    },
    userCardNum: {
        type: Number,

    },
    userCardExpiry: {
        type: Number,

    },
    userCVV: {
        type: Number,

    }
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;