const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const waitlistRoutes = require('./routes/waitlist');
const swaggerDocs = require('./utils/swagger');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(express.json());

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Database connected successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

connectDB();
app.use(cors());
app.use('/waitlist', waitlistRoutes);

// Initialize Swagger documentation
swaggerDocs(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Swagger Docs available at http://localhost:${PORT}/api-docs`);
});
