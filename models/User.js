const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true, enum: ['Farmer', 'Entrepreneur', 'Buyer', 'Change Agent'] },
    phonenumber: { type: String, required: true },
    location: { type: String, required: true },
    dateRegistered: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
