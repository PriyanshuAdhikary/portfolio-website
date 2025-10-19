const axios = require('axios');
require('dotenv').config();

async function listModels() {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        console.error('🔴 ERROR: GOOGLE_API_KEY not found in .env file.');
        return;
    }

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        const response = await axios.get(url);
        
        console.log('✅ Success! Here are the models available for your API key:');
        console.log('---------------------------------------------------------');
        
        response.data.models.forEach(model => {
            // We only care about models that support the 'generateContent' method
            if (model.supportedGenerationMethods.includes('generateContent')) {
                console.log(`➡️ Model Name: ${model.name}`);
            }
        });
        
        console.log('---------------------------------------------------------');
        console.log('Copy one of the model names (e.g., models/gemini-pro) and paste it into your server.js file.');

    } catch (error) {
        console.error('🔴 ERROR: Failed to fetch models.');
        if (error.response) {
            console.error('Details:', error.response.data);
        }
    }
}

listModels();