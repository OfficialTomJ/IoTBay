const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
    orderID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    shipmentMethod: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    tracking: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Shipment = mongoose.model('Shipment', shipmentSchema);

module.exports = Shipment;
