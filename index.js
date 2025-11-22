require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*'  // change later for security
}));

// MongoDB connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Error:", err));

// Schema / Model
const FormSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

const FormData = mongoose.model("FormData", FormSchema);

// API ROUTES

// Test route
app.get('/api/ping', (req, res) => {
  res.json({ message: "backend live", time: new Date() });
});

// Save form data
app.post('/api/saveForm', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields required" });
    }

    const saved = await FormData.create({ name, email, message });
    res.json({ success: true, data: saved });

  } catch (err) {
    res.status(500).json({ error: "Server error", details: err });
  }
});

// Get all form data
app.get('/api/getAllForms', async (req, res) => {
  try {
    const data = await FormData.find().sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: "Unable to fetch data" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
