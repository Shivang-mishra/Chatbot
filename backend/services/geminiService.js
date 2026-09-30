const { GoogleGenerativeAI } = require('@google/generative-ai');
const { queryRouter } = require('./routerService');

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

    const category = await queryRouter(messages);

    if (category === 'WEATHER' && !process.env.WEATHER_API_KEY) {
        return "I don't have access to reliable live weather data right now, so I don't want to guess.";
    }
    if (category === 'SPORTS' && !process.env.SPORTS_API_KEY) {
        return "I don't have access to reliable live sports data right now, so I don't want to guess.";
    }
    if (category === 'MARKET' && !process.env.MARKET_API_KEY) {
        return "I don't have access to reliable live market/currency data right now, so I don't want to guess.";
    }

    const now = new Date();
    const optionsDate = { timeZone: 'Asia/Kolkata', year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    const optionsTime = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };

    const currentDateStr = now.toLocaleDateString('en-US', optionsDate);
    const currentTimeStr = now.toLocaleTimeString('en-US', optionsTime);

    const systemInstruction = `You are Shivang AI, a helpful general-purpose AI assistant.
Answer the user's question directly and naturally.
Do not generate code unless the user explicitly requests code, asks to build/implement something, provides code for debugging, or code is necessary to solve the request.
For general questions, explanations, brainstorming, and casual conversation, prefer a clear textual response.
When code is requested, provide correct, well-formatted code with a concise explanation.
Do not unnecessarily generate complete applications or very large code blocks.

Current date:
${currentDateStr}

Current time:
${currentTimeStr}

Timezone:
Asia/Kolkata (IST)

- Use the supplied runtime date/time when answering current date/time questions.
- Do not guess the current date.
- Use the supplied date for today, yesterday, tomorrow and relative-date calculations.
- Do not claim current/live information unless reliable runtime/external data is provided.`;

    const modelOptions = {
        model: "gemini-robotics-er-2-preview",
        systemInstruction: systemInstruction,
    };

    if (category === 'WEB_SEARCH') {
        modelOptions.tools = [{ googleSearch: {} }];
    }

    const model = genAI.getGenerativeModel(modelOptions);

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
    let responseText = result.response.text();

    if (category === 'WEB_SEARCH' && result.response.candidates && result.response.candidates.length > 0 && result.response.candidates[0].groundingMetadata) {
        const metadata = result.response.candidates[0].groundingMetadata;
        if (metadata.groundingChunks && metadata.groundingChunks.length > 0) {
            responseText += "\n\n**Sources:**\n";
            metadata.groundingChunks.forEach(chunk => {
                if (chunk.web && chunk.web.uri) {
                    responseText += `- [${chunk.web.title}](${chunk.web.uri})\n`;
                }
            });
        }
    }

    return responseText;
}

module.exports = {
    getChatResponse
};
