require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const conversationRoutes = require('./routes/conversationRoutes');
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middlewares/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5001;

connectDB();

const allowedOrigins = process.env.FRONTEND_URL 
    ? [process.env.FRONTEND_URL] 
    : ['http://localhost:5173', 'http://localhost:5174'];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(cookieParser());

const adminRoutes = require('./routes/adminRoutes');
const chatRoutes = require('./routes/chatRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/conversations', authMiddleware.authenticateUser, conversationRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);

app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});
