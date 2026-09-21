require('dotenv').config();
const { HARRY_PROFILE } = require('./context');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { message, history = [] } = req.body || {};

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'A valid message string is required.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error:
          'Gemini API key is not configured. Please set GEMINI_API_KEY in environment variables.',
      });
    }

    // Format conversation history for Gemini
    const contents = [];

    if (Array.isArray(history) && history.length > 0) {
      history.slice(-8).forEach(msg => {
        if (msg.role && msg.content) {
          contents.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: String(msg.content) }],
          });
        }
      });
    }

    // Add current user prompt
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const payload = {
      systemInstruction: {
        parts: [{ text: HARRY_PROFILE }],
      },
      contents,
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 600,
      },
    };

    const models = ['gemini-flash-latest', 'gemini-3.5-flash-lite', 'gemini-3.6-flash'];
    let reply = null;

    for (const model of models) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const data = await response.json();
          reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            break;
          }
        }
      } catch (callErr) {
        console.error(`Attempt with ${model} failed:`, callErr.message);
      }
    }

    if (!reply) {
      reply =
        'Hi! I\'m currently unable to retrieve a response from the AI service. Please feel free to email Harry directly at arinzelight2@gmail.com!';
    }

    return res.status(200).json({ reply });
  } catch (err) {
    console.error('Chat Serverless Error:', err);
    return res.status(500).json({
      error: 'An unexpected error occurred while processing your request.',
    });
  }
};
