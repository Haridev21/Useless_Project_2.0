const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

// ⛔ Replace this with your actual Gemini API key (keep it private!)
const API_KEY = 'AIzaSyC8PvH_kZapFCrJpVf9Lq6oKXyHYXTSl_w';
//const MODEL = 'models/gemini-2.5-flash';
const MODEL = 'gemini-1.5-flash'; // remove 'models/' prefix here

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Serve frontend from /public

// Chat endpoint
app.post('/chat', async (req, res) => {
  try {
    console.log("📩 Incoming request body:", JSON.stringify(req.body, null, 2));

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
    res.json(data);
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
