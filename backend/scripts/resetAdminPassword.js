require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const connectDB = require('../config/db');

async function resetAdminPassword() {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
        console.error("ERROR: ADMIN_EMAIL or ADMIN_PASSWORD environment variables are missing.");
        console.error("Please provide them in your .env file before running the script.");
        process.exit(1);
    }

    try {
        await connectDB();
        
        const existingUser = await User.findOne({ email: adminEmail });

        if (!existingUser) {
            console.error(`ERROR: User with email ${adminEmail} does not exist.`);
            console.error("Cannot reset password for a non-existent user.");
            process.exit(1);
        }

        if (existingUser.role !== 'admin') {
            console.error(`ERROR: The user with email ${adminEmail} exists but is NOT an admin.`);
            console.error("You cannot use this script to reset passwords or promote normal users.");
            process.exit(1);
        }

        console.log(`Resetting password for admin account: ${adminEmail}...`);
        
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(adminPassword, salt);
        
        existingUser.passwordHash = passwordHash;
        await existingUser.save();
        
        console.log("Admin password successfully reset.");
    } catch (error) {
        console.error("Failed to reset admin password:", error.message);
    } finally {
        await mongoose.connection.close();
        console.log("MongoDB connection closed.");
        process.exit(0);
    }
}

resetAdminPassword();
