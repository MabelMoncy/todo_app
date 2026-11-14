const path = require('path');
const app = require('./app');

const PORT = process.env.PORT || 5000;
const DEVELOPER_NAME = process.env.DEVELOPER_NAME || 'Mabel Anto Moncy';

// When deployed as standalone backend on Vercel, the frontend is a separate project.
// The root route just shows the /name endpoint info and API health.
// When running locally, it can still serve the client/dist build if present.
if (process.env.NODE_ENV !== 'production') {
  const express = require('express');
  const clientBuildPath = path.join(__dirname, '../client/dist');
  app.use(express.static(clientBuildPath));
  app.get('*', (req, res) => {
    const indexPath = path.join(clientBuildPath, 'index.html');
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
    <p><a href="/name">Visit /name Endpoint</a></p>
    <p><a href="/api/health">API Health Check</a></p>
  </div>
</body>
</html>
        `);
      }
    });
  });
}

// Only listen if run directly (not imported as serverless module)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Developer Name: ${DEVELOPER_NAME}`);
    console.log(`Name endpoint: http://localhost:${PORT}/name`);
  });
}

// Export for Vercel serverless
module.exports = app;
