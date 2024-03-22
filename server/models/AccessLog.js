const mongoose = require('mongoose');

const accessLogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  eventType: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const AccessLog = mongoose.model('AccessLog', accessLogSchema);

module.exports = AccessLog;
