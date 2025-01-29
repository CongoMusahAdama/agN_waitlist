const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Benefit = require('../models/Benefit');
const { body, validationResult } = require('express-validator');

// Waitlist Registration - usersmodel
router.post('/register', [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('role').isIn(['Farmer', 'Entrepreneur', 'Buyer', 'Change Agent']).withMessage('Role is required'),
    body('phonenumber').isMobilePhone().withMessage('Valid phone number is required'),
    body('location').notEmpty().withMessage('Location is required'),
    ],
 async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const { name, email, role, phonenumber, location } = req.body;

    // Check for duplicate email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'Email is already registered' });
    }

    //check for duplicate phoneNumber
    const existingPhone = await User.findOne({ phonenumber });
            if (existingPhone) {
                return res.status(400).json({ message: 'Phone number is already registered' });
            }

    // Store user data in the Waitlist collection in MongoDB
    const newUser = new User({ name, email, role, phonenumber, location });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
});



//Role benefits
router.get('/benefits', async (req, res) => {
    const { role } = req.query;

    if (!role) {
        return res.status(400).json({ message: 'Role is required' });
    }

    try {
        const benefits = await Benefit.find({ role });

        if (benefits.length === 0) {
            return res.status(404).json({ message: `No benefits found for the role: ${role}` });
        }

        res.status(200).json(benefits);
    } catch (error) {
        console.error('Error fetching benefits:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



// Admin View for Waitlist - user model
router.get('/admin/waitlist', async (req, res) => {
    const { role, page = 1, limit = 10 } = req.query;
    const query = role ? { role } : {};
    
    const users = await User.find(query)
        .skip((page - 1) * limit)
        .limit(Number(limit));
    
    const totalUsers = await User.countDocuments(query);
    
    res.status(200).json({
        totalUsers,
        users,
        totalPages: Math.ceil(totalUsers / limit),
        currentPage: page
    });
});


// Update or Remove Users
router.put('/admin/waitlist/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, role, location, phonenumber  } = req.body;

    // Validate input
    if (!name && !email && !role  && !location && !phonenumber ) {
        return res.status(400).json({ message: 'At least one field is required to update' });
    }

    const updatedUser = await User.findByIdAndUpdate(id, { name, email, role, location, phonenumber }, { new: true });
    if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
});


//admin delete
router.delete('/admin/waitlist/:id', async (req, res) => {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User removed successfully' });
});

// Waitlist Statistics
router.get('/admin/waitlist/stats', async (req, res) => {
    const totalUsers = await User.countDocuments();
    const roleDistribution = await User.aggregate([
        { $group: { _id: "$role", count: { $sum: 1 } } }
    ]);

    res.status(200).json({
        totalUsers,
        roleDistribution
    });
});

module.exports = router;
