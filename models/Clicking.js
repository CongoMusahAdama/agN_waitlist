const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema({
    ipAddress: String,
    timestamp: { type: Date, default: Date.now }
});

const ClickLog = mongoose.model('ClickLog', clickSchema);

module.exports = ClickLog;
