const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    transactionID: {
        type: Int8Array,
        required: true
    },
    userCardNum: {
        type: Int16Array,
        required: true
    },
    userCardExpiry: {
        type: Int8Array,
        required: true
    },
    user_CCV: {
        type: Int8Array,
        required: true
    }
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
