require('dotenv').config({ path: './.env' });
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
        model: "gemini-robotics-er-2-preview",
        tools: [{ googleSearch: {} }]
    });
    const result = await model.generateContent("What is the latest React version?");
    console.log(JSON.stringify(result.response, null, 2));
}
test();
