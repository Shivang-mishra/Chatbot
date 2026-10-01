const express = require('express');
const router = express.Router();
const geminiService = require('../services/geminiService');
const { chatLimiter } = require('../middlewares/rateLimiter');

router.post('/public', chatLimiter, async (req, res) => {
    try {
        const { messages } = req.body;
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: "Messages array is required." });
        }
        
        const responseText = await geminiService.getChatResponse(messages);
        res.json({ content: responseText });
    } catch (error) {
        console.error("Public chat error:", error.message);
        const errMessage = error.message.toLowerCase();
        if (errMessage.includes("429") || errMessage.includes("resource_exhausted") || errMessage.includes("quota")) {
            return res.status(429).json({ error: "RATE_LIMIT" });
        }
        res.status(500).json({ error: "AI service is temporarily unavailable. Please try again." });
    }
});

module.exports = router;
