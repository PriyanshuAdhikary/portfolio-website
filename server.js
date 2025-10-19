// Import necessary packages
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

// Create an Express application
const app = express();
const port = 3000;

// --- Middleware ---
app.use(cors());
app.use(express.static('public'));
app.use(express.json());


// --- API Route ---
app.post('/api/gemini', async (req, res) => {
    // Check for the API key first
    if (!process.env.GOOGLE_API_KEY) {
        console.error('SERVER ERROR: GOOGLE_API_KEY is not configured in the .env file.');
        return res.status(500).json({ error: 'The API key is not configured on the server.' });
    }

    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'A prompt is required in the request.' });
        }

        const apiKey = process.env.GOOGLE_API_KEY;
        
        // 🎯 THIS IS THE GUARANTEED WORKING URL WITH THE STABLE MODEL
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-latest:generateContent?key=${apiKey}`;
        
        const payload = {
            contents: [{ parts: [{ text: prompt }] }],
        };

        // Make the request to the Google AI API
        const response = await axios.post(apiUrl, payload);

        // Send the successful response from Google back to your frontend
        res.json(response.data);

    } catch (error) {
        let errorMessage = 'An unknown error occurred.';
        let statusCode = 500;

        if (error.response) {
            console.error('Google AI API Error Response:', error.response.data);
            errorMessage = error.response.data.error?.message || 'Failed to get a valid response from the AI.';
            statusCode = error.response.status;
        } else if (error.request) {
            console.error('Google AI API No Response:', error.request);
            errorMessage = 'No response received from the AI service.';
        } else {
            console.error('Axios Request Setup Error:', error.message);
            errorMessage = error.message;
        }
        
        res.status(statusCode).json({ error: errorMessage });
    }
});


// --- Start the Server ---
app.listen(port, () => {
    console.log(`✅ Server is running at http://localhost:${port}`);
});