const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const { connectDB, getDbDiagnostics } = require('./config/db');
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

// Serve static assets from client/dist if present
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
}

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
  const diag = getDbDiagnostics();
  res.status(200).json({
    status: 'OK',
    uptime: process.uptime(),
    db: diag,
  });
});

// Root route & catch-all: displays the Todo app as required by assignment:
// "The backend base URL should display the Todo app."
app.get('*', (req, res) => {
  const clientIndexPath = path.join(__dirname, '../client/dist/index.html');
  if (fs.existsSync(clientIndexPath)) {
    return res.sendFile(clientIndexPath);
  }

  // Standalone serverless fallback: renders the interactive Todo App UI
  res.type('text/html').send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MERN Todo App | ${DEVELOPER_NAME}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen py-10 px-4">
  <div class="max-w-2xl mx-auto">
    <div class="flex items-center justify-between pb-6 border-b border-slate-800 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-white">Task<span class="text-indigo-400">Flow</span></h1>
        <p class="text-xs text-slate-400">Full-Stack MERN Todo App</p>
      </div>
      <a href="/name" target="_blank" class="px-3.5 py-1.5 bg-indigo-950/70 border border-indigo-700/60 rounded-xl text-xs text-indigo-300 hover:text-white transition">
        Developer: <strong>${DEVELOPER_NAME}</strong> (Verify /name)
      </a>
    </div>

    <!-- Add Todo Form -->
    <form id="add-form" class="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-6 shadow-xl">
      <div class="flex gap-2 mb-2">
        <input id="todo-title" type="text" placeholder="What needs to be done?..." required class="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
        <button type="submit" class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition">Add Task</button>
      </div>
      <input id="todo-desc" type="text" placeholder="Add optional details..." class="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none">
    </form>

    <!-- Todos List -->
    <div id="todo-list" class="space-y-2.5">
      <div class="text-center py-10 text-slate-500 text-sm">Loading tasks from MongoDB...</div>
    </div>
  </div>

  <script>
    const listEl = document.getElementById('todo-list');
    const formEl = document.getElementById('add-form');

    async function loadTodos() {
      try {
        const res = await fetch('/api/todos');
        const data = await res.json();
        renderTodos(data.data || []);
      } catch (e) {
        listEl.innerHTML = '<div class="text-rose-400 text-sm p-4 bg-rose-950/30 rounded-xl">Failed to load tasks</div>';
      }
    }

    function renderTodos(todos) {
      if (!todos.length) {
        listEl.innerHTML = '<div class="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400 text-sm">No tasks yet. Add one above!</div>';
        return;
      }
      listEl.innerHTML = todos.map(t => \`
        <div class="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-xl \${t.completed ? 'opacity-60' : ''}">
          <div class="flex items-center gap-3">
            <input type="checkbox" \${t.completed ? 'checked' : ''} onchange="toggleComplete('\${t._id}', \${!t.completed})" class="w-4 h-4 rounded text-indigo-600 cursor-pointer">
            <div>
              <p class="text-sm font-medium \${t.completed ? 'line-through text-slate-500' : 'text-slate-100'}">\${t.title}</p>
              \${t.description ? \`<p class="text-xs text-slate-400 mt-0.5">\${t.description}</p>\` : ''}
            </div>
          </div>
          <button onclick="deleteTodo('\${t._id}')" class="text-xs text-rose-400 hover:text-rose-300 px-2 py-1 bg-slate-800 rounded-lg">Delete</button>
        </div>
      \`).join('');
    }

    formEl.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = document.getElementById('todo-title').value.trim();
      const description = document.getElementById('todo-desc').value.trim();
      if (!title) return;
      await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description })
      });
      document.getElementById('todo-title').value = '';
      document.getElementById('todo-desc').value = '';
      loadTodos();
    });

    async function toggleComplete(id, completed) {
      await fetch('/api/todos/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed })
      });
      loadTodos();
    }

    async function deleteTodo(id) {
      await fetch('/api/todos/' + id, { method: 'DELETE' });
      loadTodos();
    }

    loadTodos();
  </script>
</body>
</html>
  `);
});

module.exports = app;
