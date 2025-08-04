// Load environment variables from .env
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;
const MODEL = 'gemini-1.5-flash';

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/splashscreen.html');
});

app.post('/chat', async (req, res) => {
  try {
    console.log("📩 Incoming request body:", JSON.stringify(req.body, null, 2));
    console.log("🔑 API_KEY present:", !!API_KEY); // Just to confirm key presence

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: req.body.contents })
      }
    );

    const data = await response.json();
    console.log("📤 Gemini API response:", JSON.stringify(data, null, 2));

    if (
      !data?.candidates?.[0]?.content?.parts?.[0]?.text
    ) {
      return res.status(500).json({ error: "Incomplete Gemini response" });
    }

    res.json(data);
  } catch (err) {
    console.error("❌ Error during fetch:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
