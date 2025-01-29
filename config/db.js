require('dotenv').config(); 

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;  
        if (!uri) {
            throw new Error('MONGODB_URI is not defined in .env file');
        }
        await mongoose.connect(uri);
        console.log('MongoDB connected sucessfully');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

module.exports = connectDB;
