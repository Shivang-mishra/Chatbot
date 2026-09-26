const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY;
let genAI = null;

if (apiKey) {
    genAI = new GoogleGenerativeAI(apiKey);
}

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

async function getChatResponse(messages) {
    if (!genAI) {
        throw new Error("GEMINI_API_KEY is not configured.");
    }
    
    // Validate messages array
    if (!Array.isArray(messages) || messages.length === 0) {
        throw new Error("Messages must be a non-empty array.");
    }

    const model = genAI.getGenerativeModel({
        model: "gemini-robotics-er-2-preview",
    });

    // The last message is the new prompt
    const promptMessage = messages[messages.length - 1];
    const prompt = promptMessage.content;
    
    // The previous messages form the history
    const historyMessages = messages.slice(0, -1);
    const history = historyMessages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
    }));

    const chatSession = model.startChat({
        generationConfig,
        history,
    });

    const result = await chatSession.sendMessage(prompt);
    return result.response.text();
}

module.exports = {
    getChatResponse
};
