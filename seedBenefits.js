const connectDB = require('./config/db');
const Benefit = require('./models/Benefit'); 
require('dotenv').config();

// Connect to the database using the connectDB function
connectDB();

const benefits = [
    { role: 'Farmer', description: 'AI-driven advisory services improve crop management, soil health, pest, and disease control.' },
    { role: 'Farmer', description: 'Real-time weather forecasts and soil health analysis assist in planning planting, irrigation, and harvesting schedules.' },
    { role: 'Farmer', description: 'Direct access to buyers and entrepreneurs for selling produce at competitive prices.' },
    { role: 'Farmer', description: 'Ability to purchase agricultural inputs (seeds, fertilizers, tools) via the e-commerce platform.' },
    { role: 'Farmer', description: 'Community forums for learning best practices and seeking advice from peers and experts.' },
    { role: 'Farmer', description: 'Alerts for weather changes, pest risks, and upcoming tasks to ensure optimal productivity.' },
    { role: 'Farmer', description: 'Recommendations for eco-friendly farming methods that reduce costs and enhance yields.' },
    
    { role: 'Entrepreneur', description: 'Tools to connect with farmers, suppliers, and buyers, ensuring efficient product flow.' },
    { role: 'Entrepreneur', description: 'Access to local and international markets to sell agricultural products.' },
    { role: 'Entrepreneur', description: 'Integration with financial services for loans, credit, and better cash flow management.' },
    { role: 'Entrepreneur', description: 'Data analytics for tracking yields, market trends, and supply-demand dynamics.' },
    { role: 'Entrepreneur', description: 'Links with farmers and change agents to build partnerships and scale business operations.' },
    { role: 'Entrepreneur', description: 'Simplified procurement of agricultural inputs and other necessities through the platform.' },

    { role: 'Buyer', description: 'Ability to purchase fresh and high-quality agricultural products directly from farmers and entrepreneurs.' },
    { role: 'Buyer', description: 'Competitive pricing by eliminating middlemen through direct transactions.' },
    { role: 'Buyer', description: 'Clear information on product origin, quality, and pricing for informed purchasing decisions.' },
    { role: 'Buyer', description: 'Access to diverse agricultural products via the platform.' },
    { role: 'Buyer', description: 'Seamless transactions through integrated e-commerce and payment systems.' },

    { role: 'Change Agent', description: 'Access to AI-driven insights and resources to better support and guide farmers and entrepreneurs.' },
    { role: 'Change Agent', description: 'Ability to oversee operational areas and manage groups of farmers effectively.' },
    { role: 'Change Agent', description: 'Tools to disseminate knowledge, conduct training sessions, and promote sustainable practices.' },
    { role: 'Change Agent', description: 'Networking with entrepreneurs and buyers to bridge gaps and facilitate growth.' },
    { role: 'Change Agent', description: 'Multilingual support and hyperlocal data allow agents to cater to diverse communities.' },
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
