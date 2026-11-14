const path = require('express').static;
const expressPath = require('path');
const app = require('./app');

const PORT = process.env.PORT || 5000;
const DEVELOPER_NAME = process.env.DEVELOPER_NAME || 'Mabel Anto Moncy';

// Serve frontend build if available (Backend base URL should display the Todo app)
const clientBuildPath = expressPath.join(__dirname, '../client/dist');
const express = require('express');
app.use(express.static(clientBuildPath));

app.get('*', (req, res) => {
  const indexPath = expressPath.join(clientBuildPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
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
    <p>Run <code>npm run build</code> in <code>client/</code> to view the UI at this root URL.</p>
    <p><a href="/name">Visit /name Endpoint</a></p>
  </div>
</body>
</html>
      `);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Developer Name: ${DEVELOPER_NAME}`);
  console.log(`Name endpoint: http://localhost:${PORT}/name`);
});
