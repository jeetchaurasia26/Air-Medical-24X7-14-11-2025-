// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || '*' // lock this down in production
}));
app.use(express.json()); // parse JSON bodies

// simple test endpoint
app.get('/api/ping', (req, res) => {
  res.json({message: 'pong', time: new Date().toISOString()});
});

// example: contact form endpoint
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  // TODO: save to DB or send email; for now, just echo
  // In production, add rate-limiting and spam protections
  console.log('Contact received:', {name, email, message});
  res.json({ status: 'success', received: { name, email, message }});
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
