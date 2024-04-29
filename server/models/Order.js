const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        required: true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    totalCost: {
        type: Number,
        required: true
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    paymentID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment'
    },
    shipmentID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shipment'
    },
    confirmed: {
        type: Boolean,
        default: false
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
