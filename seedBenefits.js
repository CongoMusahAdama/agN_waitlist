const connectDB = require('./config/db');
const Benefit = require('./models/Benefit'); 
require('dotenv').config();

// Connect to the database using the connectDB function
connectDB();

const benefits = [
    { role: 'Investor', description: 'Diversified agri-investment portfolios' },
    { role: 'Investor', description: 'Transparent ROI tracking and farm performance analytics' },
    { role: 'Investor', description: 'Lower investment risks with AgriLync’s verification system' },
    { role: 'Investor', description: 'Opportunities for long-term profit generation' },
    { role: 'Investor', description: 'Impact-driven investments in sustainable farming' },
    
    { role: 'Farmer', description: 'Access to funding through the FarmPartner Initiative' },
    { role: 'Farmer', description: 'AI-driven insights for crop management, soil health, pest control, and weather forecasting' },
    { role: 'Farmer', description: 'Direct market access to sell produce at competitive prices' },
    { role: 'Farmer', description: 'Support for financial stability and farm expansion' },
    { role: 'Farmer', description: 'Connection with agricultural experts and extension services' },

    { role: 'Entrepreneur', description: 'Structured investment opportunities in agriculture without direct farm management' },
    { role: 'Entrepreneur', description: 'Access to verified farmers with credibility checks' },
    { role: 'Entrepreneur', description: 'Real-time farm performance monitoring' },
    { role: 'Entrepreneur', description: 'Business networking and partnership opportunities in agribusiness' },
    { role: 'Entrepreneur', description: 'Contribution to sustainable agriculture and food security' },

    { role: 'Buyer', description: 'Direct sourcing from trusted farmers for fresh, high-quality produce' },
    { role: 'Buyer', description: 'Price transparency and access to multiple farm suppliers' },
    { role: 'Buyer', description: 'Bulk purchase deals with reliable delivery options' },
    { role: 'Buyer', description: 'Traceability and food safety assurance' },
    { role: 'Buyer', description: 'Reduced supply chain inefficiencies through smart logistics' }
];



   

(async () => {
    try {
        // Clearing the existing benefits
        await Benefit.deleteMany({});
        console.log('Existing benefits cleared');

        // Inserting new benefits into the collection
        const insertedBenefits = await Benefit.insertMany(benefits);
        console.log('Inserted Benefits:', insertedBenefits);

        // Fetching all benefits to confirm the insert
        const allBenefits = await Benefit.find({});
        console.log('All Benefits in Collection:', allBenefits);

        process.exit(0);  // Exit script gracefully
    } catch (error) {
        console.error('Error occurred:', error);
        process.exit(1);  // Exit with an error code
    }
})();
