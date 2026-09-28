require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const connectDB = require('../config/db');

async function seedAdmin() {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
        console.error("ERROR: ADMIN_EMAIL or ADMIN_PASSWORD environment variables are missing.");
        console.error("Please provide them before running the seed script.");
        process.exit(1);
    }

    try {
        await connectDB();
        
        const existingUser = await User.findOne({ email: adminEmail });

        if (existingUser) {
            if (existingUser.role === 'admin') {
                console.log(`Admin account for ${adminEmail} already exists.`);
            } else {
                console.error(`ERROR: The email ${adminEmail} already belongs to a normal user.`);
                console.error("Manual confirmation/action is required. We will not silently promote this user.");
            }
        } else {
            console.log(`Creating new admin account for ${adminEmail}...`);
            
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(adminPassword, salt);
            
            const adminUser = new User({
                name: 'Admin',
                email: adminEmail,
                passwordHash,
                role: 'admin'
            });
            
            await adminUser.save();
            console.log("Admin account created successfully.");
        }
    } catch (error) {
        console.error("Failed to seed admin:", error.message);
    } finally {
        await mongoose.connection.close();
        console.log("MongoDB connection closed.");
        process.exit(0);
    }
}

seedAdmin();
