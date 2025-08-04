require('dotenv').config(); // Load .env

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

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/splashscreen.html');
});

app.post('/chat', async (req, res) => {
  try {
    console.log("📩 Incoming request body:", JSON.stringify(req.body, null, 2));
    console.log("🔑 API_KEY used:", API_KEY); // Debug

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

    // Basic check before sending
    if (!data || !data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
      return res.status(500).json({ error: "Incomplete Gemini response" });
    }

    res.json(data);
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
