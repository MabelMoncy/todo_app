const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const todoRoutes = require('./routes/todoRoutes');

// Load environment variables (supports root .env, server/.env, and system env vars)
dotenv.config();
dotenv.config({ path: path.join(__dirname, '.env') });

// Attempt early DB connection
connectDB().catch((err) => console.error('Initial DB connection attempt:', err.message));

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

const DEVELOPER_NAME = process.env.DEVELOPER_NAME || 'Mabel Anto Moncy';

// Developer Name endpoint (Requirement: BASE_URL/name displays Developer Name: <Name>)
app.get('/name', (req, res) => {
  // If explicitly requested JSON without html
  if (req.headers.accept && req.headers.accept.includes('application/json') && !req.headers.accept.includes('text/html')) {
    return res.json({
      developerName: DEVELOPER_NAME,
      formatted: `Developer Name: ${DEVELOPER_NAME}`
    });
  }

  // Display visibly on screen for browser visits
  res.type('text/html').send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Developer Name</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
      color: #f8fafc;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0;
      padding: 1rem;
    }
    .card {
      background: rgba(30, 41, 59, 0.85);
      border: 1px solid rgba(148, 163, 184, 0.2);
      border-radius: 16px;
      padding: 2.5rem 3.5rem;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(8px);
    }
    h1 {
      font-size: 2rem;
      margin: 0 0 1rem 0;
      color: #38bdf8;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    p {
      color: #94a3b8;
      margin: 0 0 1.5rem 0;
      font-size: 1rem;
    }
    .badge {
      display: inline-block;
      padding: 0.35rem 0.85rem;
      background: rgba(56, 189, 248, 0.15);
      color: #38bdf8;
      border: 1px solid rgba(56, 189, 248, 0.3);
      border-radius: 9999px;
      font-size: 0.85rem;
      font-weight: 500;
    }
    a {
      color: #818cf8;
      text-decoration: none;
      font-weight: 500;
    }
    a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="card">
    <div style="margin-bottom: 1rem;">
      <span class="badge">MERN Stack Assignment</span>
    </div>
    <h1>Developer Name: ${DEVELOPER_NAME}</h1>
    <p>Backend endpoint verified successfully</p>
    <a href="/">← Go to Todo App</a>
  </div>
</body>
</html>
  `);
});

// API Routes
app.use('/api/todos', todoRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    uptime: process.uptime(),
    dbState: require('mongoose').connection.readyState,
  });
});

module.exports = app;
