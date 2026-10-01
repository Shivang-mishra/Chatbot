const rateLimit = require('express-rate-limit');

// Chat endpoint limiter
const chatLimiter = rateLimit({
    windowMs: parseInt(process.env.CHAT_RATE_LIMIT_WINDOW_MS) || 60 * 1000, // 1 minute default
    max: parseInt(process.env.CHAT_RATE_LIMIT_MAX) || 20, // 20 requests per minute default
    message: { error: "Too many requests. Please wait a moment before trying again." },
    standardHeaders: true,
    legacyHeaders: false,
});

// Login endpoint limiter
const loginLimiter = rateLimit({
    windowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS) || 60 * 1000, // 1 minute default
    max: parseInt(process.env.AUTH_RATE_LIMIT_MAX) || 5, // 5 requests per minute
    message: { error: "Too many login attempts. Please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});

// Register endpoint limiter (stricter)
const registerLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5, // 5 requests per 10 minutes
    message: { error: "Too many registration attempts. Please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});

// General API limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per 15 minutes
    message: { error: "Too many requests from this IP, please try again after 15 minutes" },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    chatLimiter,
    loginLimiter,
    registerLimiter,
    apiLimiter
};
