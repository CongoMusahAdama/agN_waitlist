const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Benefit = require('../models/Benefit');
const { body, validationResult } = require('express-validator');
const { clicking } = require ('../models/Clicking')

//TODO: will use .env to encrypt it
const WHATSAPP_INVITE_LINK = 'process.env.WHATSAPP_INVITE_LINK;';

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         role:
 *           type: string
 *           enum: [Farmer, Entrepreneur, Buyer, Change Agent]
 *         phonenumber:
 *           type: string
 *         location:
 *           type: string
 */

/**
 * @swagger
 * /waitlist/register:
 *   post:
 *     summary: Register a new user to the waitlist
 *     tags: [Waitlist]
 *     requestBody:
 *       required: true
 *       content: 
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201: 
 *         description: User registered successfully
 *       400:
 *         description: Validation errors or duplicate email/phone number
 */

// Waitlist Registration - usersmodel
router.post('/register', [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('role').isIn(['Farmer', 'Entrepreneur', 'Buyer', 'Investor']).withMessage('Role is required'),
    body('phonenumber').isMobilePhone().withMessage('Valid phone number is required'),
    body('location').notEmpty().withMessage('Location is required'),
], async (req, res) => {
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

    // Check for duplicate phone number
    const existingPhone = await User.findOne({ phonenumber });
    if (existingPhone) {
        return res.status(400).json({ message: 'Phone number is already registered' });
    }

    // Store user data in the Waitlist collection in MongoDB
    const newUser = new User({ name, email, role, phonenumber, location });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
});

/**
 * @swagger
 * /waitlist/benefits:
 *   get:
 *     summary: Get benefits based on user role
 *     tags: [Waitlist]
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         required: true
 *         description: Role of the user to filter benefits
 *     responses:
 *       200:
 *         description: List of benefits
 *       400:
 *         description: Role is required
 *       404:
 *         description: No benefits found
 */

// Role benefits
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

/**
 * @swagger
 * /waitlist/admin/waitlist:
 *   get:
 *     summary: Admin view of all users in the waitlist
 *     tags: [Waitlist]
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: Filter users by role (optional)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of users per page
 *     responses:
 *       200:
 *         description: A list of users with pagination
 *       404:
 *         description: No users found
 */

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

/**
 * @swagger
 * /waitlist/admin/waitlist/{id}:
 *   put:
 *     summary: Update user details
 *     tags: [Waitlist]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [Farmer, Entrepreneur, Buyer, Change Agent]
 *               location:
 *                 type: string
 *               phonenumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Validation errors or required fields missing
 *       404:
 *         description: User not found
 */

// Update or Remove Users
router.put('/admin/waitlist/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, role, location, phonenumber } = req.body;

    // Validate input
    if (!name && !email && !role && !location && !phonenumber) {
        return res.status(400).json({ message: 'At least one field is required to update' });
    }

    const updatedUser = await User.findByIdAndUpdate(id, { name, email, role, location, phonenumber }, { new: true });
    if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
});

/**
 * @swagger
 * /waitlist/admin/waitlist/{id}:
 *   delete:
 *     summary: Remove user from the waitlist
 *     tags: [Waitlist]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to remove
 *     responses:
 *       200:
 *         description: User removed successfully
 *       404:
 *         description: User not found
 */

// Admin delete
router.delete('/admin/waitlist/:id', async (req, res) => {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User removed successfully' });
});

/**
 * @swagger
 * /waitlist/admin/waitlist/stats:
 *   get:
 *     summary: Get statistics about users in the waitlist
 *     tags: [Waitlist]
 *     responses:
 *       200:
 *         description: Statistical data on the total users and role distribution
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: integer
 *                   example: 150
 *                 roleDistribution:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "Farmer"
 *                       count:
 *                         type: integer
 *                         example: 50
 *             example:
 *               totalUsers: 150
 *               roleDistribution:
 *                 - _id: "Farmer"
 *                   count: 50
 *                 - _id: "Entrepreneur"
 *                   count: 30
 *                 - _id: "Buyer"
 *                   count: 20
 *                 - _id: "Change Agent"
 *                   count: 50
 */

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

// Route to Join WhatsApp Community
router.get('/waitlist/join-whatsapp', async (req, res) => {
    try {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        await ClickLog.create({ ipAddress: ip });
        console.log(`User Click Logged: ${ip} at ${new Date().toISOString()}`);
        res.redirect(WHATSAPP_INVITE_LINK);
    } catch (error) {
        console.error('Error Logging Click:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});
module.exports = router;
