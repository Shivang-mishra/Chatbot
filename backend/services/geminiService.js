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
    
    if (!Array.isArray(messages) || messages.length === 0) {
        throw new Error("Messages must be a non-empty array.");
    }

    const systemInstruction = `You are Shivang AI, a helpful general-purpose AI assistant.
Answer the user's question directly and naturally.
Do not generate code unless the user explicitly requests code, asks to build/implement something, provides code for debugging, or code is necessary to solve the request.
For general questions, explanations, brainstorming, and casual conversation, prefer a clear textual response.
When code is requested, provide correct, well-formatted code with a concise explanation.
Do not unnecessarily generate complete applications or very large code blocks.`;

    const model = genAI.getGenerativeModel({
        model: "gemini-robotics-er-2-preview",
        systemInstruction: systemInstruction,
    });

    const promptMessage = messages[messages.length - 1];
    const prompt = promptMessage.content;
    
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
