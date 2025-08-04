const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000; // ✅ Fix here

const API_KEY = 'AIzaSyC8PvH_kZapFCrJpVf9Lq6oKXyHYXTSl_w';
const MODEL = 'gemini-1.5-flash';

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Serve frontend

// ✅ Root route (optional, helpful for Render)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

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
