const User = require('../models/User');

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-passwordHash');
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to fetch users." });
    }
};
