const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const adminController = require('../controllers/adminController');

router.get('/dashboard', authMiddleware.authenticateUser, authMiddleware.requireAdmin, (req, res) => {
    res.json({ message: "Welcome to the Admin Dashboard!", status: "success" });
});

router.get('/users', authMiddleware.authenticateUser, authMiddleware.requireAdmin, adminController.getUsers);

module.exports = router;
