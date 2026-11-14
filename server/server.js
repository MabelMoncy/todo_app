const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const todoRoutes = require('./routes/todoRoutes');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const DEVELOPER_NAME = process.env.DEVELOPER_NAME || 'Mabel Anto Moncy';

// Developer Name endpoint (Requirement: BASE_URL/name displays Developer Name: <Name>)
app.get('/name', (req, res) => {
  // If explicitly requested JSON
  if (req.headers.accept && req.headers.accept.includes('application/json') && !req.headers.accept.includes('text/html')) {
    return res.json({
      developerName: DEVELOPER_NAME,
      formatted: `Developer Name: ${DEVELOPER_NAME}`
    });
  }

  // Display on screen for browser visits
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
  res.status(200).json({ status: 'OK', uptime: process.uptime() });
});

// Serve frontend build if available (Backend base URL should display the Todo app)
const clientBuildPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientBuildPath));

app.get('*', (req, res) => {
  const indexPath = path.join(clientBuildPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      // Fallback if client has not been built yet
      res.type('text/html').send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>MERN Todo App</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #0f172a; color: #e2e8f0; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
    .box { text-align: center; padding: 2rem; border: 1px solid #334155; border-radius: 12px; background: #1e293b; max-width: 500px; }
    h1 { color: #38bdf8; margin-top: 0; }
    a { color: #818cf8; }
  </style>
</head>
<body>
  <div class="box">
    <h1>Todo App Backend Running</h1>
    <p>Build the frontend (<code>npm run build</code> in <code>/client</code>) to serve the full UI at this root URL.</p>
    <p><a href="/name">Visit /name Endpoint</a></p>
  </div>
</body>
</html>
      `);
    }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Developer Name: ${DEVELOPER_NAME}`);
  console.log(`Name endpoint available at: http://localhost:${PORT}/name`);
});
