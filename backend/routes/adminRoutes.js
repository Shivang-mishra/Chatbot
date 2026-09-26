const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/dashboard', authMiddleware.authenticateUser, authMiddleware.requireAdmin, (req, res) => {
    res.json({ message: "Welcome to the Admin Dashboard!", status: "success" });
});

module.exports = router;
