const geminiService = require('../services/geminiService');

async function handleChat(req, res) {
    try {
        const { messages } = req.body;
        
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ error: "Invalid request: 'messages' must be a non-empty array." });
        }
        
        // Basic validation of messages
        for (const msg of messages) {
            if (!msg.role || !msg.content || typeof msg.content !== 'string' || !msg.content.trim()) {
                return res.status(400).json({ error: "Invalid request: each message must have a valid 'role' and 'content'." });
            }
        }
        
        const responseText = await geminiService.getChatResponse(messages);
        
        res.json({ response: responseText });
    } catch (error) {
        console.error("Error in chatController:", error.message);
        
        if (error.message.includes("GEMINI_API_KEY")) {
            return res.status(500).json({ error: "Server configuration error." });
        }
        
        res.status(500).json({ error: "Failed to communicate with AI service." });
    }
}

module.exports = {
    handleChat
};
