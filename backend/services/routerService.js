const { GoogleGenerativeAI } = require('@google/generative-ai');

async function queryRouter(messages) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.");
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
        model: "gemini-robotics-er-2-preview",
        systemInstruction: `You are a query routing engine. Categorize the user's LAST message into exactly ONE of the following categories:
GENERAL - Factual knowledge, programming, logic, translation, coding, generic questions.
CURRENT_DATE_TIME - Asking about the current date, time, today, yesterday, tomorrow, etc.
WEB_SEARCH - Asking for the latest news, recent events, current software versions, or facts that likely changed after 2023.
WEATHER - Asking for current or live weather/temperature.
SPORTS - Asking for live sports scores, matches, fixtures.
MARKET - Asking for live stock prices, crypto prices, or exchange rates.
UNKNOWN - Ambiguous or unclear questions.

Respond with ONLY the exact string of the category. No punctuation or markdown.`
    });

    const promptMessage = messages[messages.length - 1].content;
    const result = await model.generateContent(promptMessage);
    let category = result.response.text().trim();
    
    // Fallback if the model gives weird output
    const validCategories = ['GENERAL', 'CURRENT_DATE_TIME', 'WEB_SEARCH', 'WEATHER', 'SPORTS', 'MARKET', 'UNKNOWN'];
    if (!validCategories.includes(category)) {
        category = 'GENERAL';
    }
    
    return category;
}

module.exports = { queryRouter };
