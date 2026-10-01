const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const geminiService = require('../services/geminiService');

exports.createConversation = async (req, res) => {
    try {
        const { messageContent } = req.body;
        
        let title = "New Conversation";
        if (messageContent) {
            title = messageContent.length > 30 ? messageContent.substring(0, 27) + "..." : messageContent;
        }

        const conversation = new Conversation({ title, userId: req.user.userId });
        await conversation.save();

        res.status(201).json(conversation);
    } catch (error) {
        console.error("Error creating conversation:", error.message);
        res.status(500).json({ error: "Failed to create conversation." });
    }
};

exports.getConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find({ userId: req.user.userId }).sort({ createdAt: -1 });
        res.json(conversations);
    } catch (error) {
        console.error("Error getting conversations:", error.message);
        res.status(500).json({ error: "Failed to get conversations." });
    }
};

exports.getConversationById = async (req, res) => {
    try {
        const conversation = await Conversation.findOne({ _id: req.params.id, userId: req.user.userId });
        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found." });
        }
        
        const messages = await Message.find({ conversationId: conversation._id }).sort({ createdAt: 1 });
        
        res.json({ conversation, messages });
    } catch (error) {
        console.error("Error getting conversation:", error.message);
        res.status(500).json({ error: "Failed to get conversation." });
    }
};

exports.deleteConversation = async (req, res) => {
    try {
        const conversationId = req.params.id;
        const conversation = await Conversation.findOneAndDelete({ _id: conversationId, userId: req.user.userId });
        
        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found." });
        }
        
        await Message.deleteMany({ conversationId });
        
        res.json({ message: "Conversation deleted successfully." });
    } catch (error) {
        console.error("Error deleting conversation:", error.message);
        res.status(500).json({ error: "Failed to delete conversation." });
    }
};

exports.renameConversation = async (req, res) => {
    try {
        const conversationId = req.params.id;
        const { title } = req.body;
        
        if (!title || !title.trim()) {
            return res.status(400).json({ error: "Title is required." });
        }
        
        const conversation = await Conversation.findOneAndUpdate(
            { _id: conversationId, userId: req.user.userId },
            { title },
            { new: true }
        );
        
        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found." });
        }
        
        res.json(conversation);
    } catch (error) {
        console.error("Error renaming conversation:", error.message);
        res.status(500).json({ error: "Failed to rename conversation." });
    }
};

exports.addMessageToConversation = async (req, res) => {
    try {
        const conversationId = req.params.id;
        const { content } = req.body;
        
        if (!content || !content.trim()) {
            return res.status(400).json({ error: "Message content is required." });
        }
        
        const conversation = await Conversation.findOne({ _id: conversationId, userId: req.user.userId });
        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found." });
        }
        
        const userMessage = new Message({
            conversationId,
            role: 'user',
            content
        });
        await userMessage.save();
        
        const allMessages = await Message.find({ conversationId }).sort({ createdAt: 1 });
        const messagesForGemini = allMessages.map(msg => ({ role: msg.role, content: msg.content }));
        
        let responseText;
        try {
            responseText = await geminiService.getChatResponse(messagesForGemini);
        } catch (geminiError) {
            console.error("Gemini Error:", geminiError.message);
            const errMessage = geminiError.message.toLowerCase();
            if (errMessage.includes("429") || errMessage.includes("resource_exhausted") || errMessage.includes("quota")) {
                return res.status(429).json({ error: "RATE_LIMIT" });
            }
            return res.status(500).json({ error: "AI service is temporarily unavailable. Please try again." });
        }
        
        const assistantMessage = new Message({
            conversationId,
            role: 'assistant',
            content: responseText
        });
        await assistantMessage.save();
        
        conversation.updatedAt = new Date();
        await conversation.save();
        
        res.status(201).json(assistantMessage);
    } catch (error) {
        console.error("Error adding message:", error.message);
        res.status(500).json({ error: "Failed to add message." });
    }
};
