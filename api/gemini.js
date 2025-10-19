const axios = require('axios');

// This is the corrected CommonJS export that Vercel requires
module.exports = async (req, res) => {
    // Check if the API key is available
    if (!process.env.GOOGLE_API_KEY) {
        console.error('SERVER ERROR: GOOGLE_API_KEY is not configured.');
        return res.status(500).json({ error: 'The API key is not configured on the server.' });
    }

    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'A prompt is required in the request.' });
        }

        const apiKey = process.env.GOOGLE_API_KEY;
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-latest:generateContent?key=${apiKey}`;
        
        const payload = {
            contents: [{ parts: [{ text: prompt }] }],
        };

        const response = await axios.post(apiUrl, payload);
        
        // Send the successful response back
        res.status(200).json(response.data);

    } catch (error) {
        let errorMessage = 'An unknown error occurred while contacting the AI service.';
        if (error.response) {
            console.error('Google AI API Error Response:', error.response.data);
            errorMessage = error.response.data.error?.message || 'Failed to get a valid response from the AI.';
        }
        res.status(500).json({ error: errorMessage });
    }
};