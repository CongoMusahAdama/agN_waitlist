const mongoose = require('mongoose');

const benefitSchema = new mongoose.Schema({
    role: { type: String, required: true, enum: ['Farmer', 'Entrepreneur', 'Buyer', 'Change Agent'] },
    description: { type: String, required: true }
});

module.exports = mongoose.model('Benefit', benefitSchema);
