const express = require('express');
const router = express.Router();
const geminiService = require('../services/geminiService');

router.post('/public', async (req, res) => {
    try {
        const { messages } = req.body;
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: "Messages array is required." });
        }
        
        const responseText = await geminiService.getChatResponse(messages);
        res.json({ content: responseText });
    } catch (error) {
        console.error("Public chat error:", error.message);
        res.status(500).json({ error: "Failed to process chat." });
    }
});

module.exports = router;
