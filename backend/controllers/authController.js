const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Name, email, and password are required." });
        }
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email is already registered." });
        }
        
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        
        const user = new User({
            name,
            email,
            passwordHash,
            role: 'user'
        });
        
        await user.save();
        
        res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
        console.error("Error in register:", error);
        res.status(500).json({ error: "Failed to register user." });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required." });
        }
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials." });
        }
        
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials." });
        }
        
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        
        const isProd = process.env.NODE_ENV === 'production';
        res.cookie('token', token, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        
        res.json({ message: "Logged in successfully.", user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ error: "Failed to log in." });
    }
};

exports.me = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-passwordHash');
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        res.json(user);
    } catch (error) {
        console.error("Error in me:", error);
        res.status(500).json({ error: "Failed to get user." });
    }
};

exports.logout = (req, res) => {
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('token', '', {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        expires: new Date(0)
    });
    res.json({ message: "Logged out successfully." });
};
