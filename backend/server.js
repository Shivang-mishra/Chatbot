require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const chatRoutes = require('./routes/chatRoutes');

const authMiddleware = require('./middlewares/authMiddleware');
const { apiLimiter } = require('./middlewares/rateLimiter');

const app = express();

app.set('trust proxy', 1);

const PORT = process.env.PORT || 5001;

connectDB();

const allowedOrigins = process.env.FRONTEND_URL
    ? [process.env.FRONTEND_URL]
    : ['http://localhost:5173', 'http://localhost:5174'];

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true
    })
);

app.use(express.json());
app.use(cookieParser());

app.use('/api', apiLimiter);

app.use('/api/auth', authRoutes);
app.use(
    '/api/conversations',
    authMiddleware.authenticateUser,
    conversationRoutes
);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);

app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});