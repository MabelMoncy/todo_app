# MERN Stack Todo App (Vercel Monorepo)

A production-ready full-stack MERN (MongoDB, Express, React, Node.js) Todo application configured for seamless **single-repo Vercel monorepo deployment**.

---

## 📋 Mandatory Assignment Submission

- **Developer Name:** Mabel Anto Moncy
- **Live Frontend URL:** https://todoapp-ten-eta.vercel.app/
- **Live Backend Base URL:** https://todoapp-ten-eta.vercel.app/api/health
- **GitHub Repository URL:** [https://github.com/MabelMoncy/todo_app.git](https://github.com/MabelMoncy/todo_app.git)

> Both frontend and backend are deployed together via Vercel. Visiting the Backend Base URL displays the full Todo App, and visiting `/name` displays `Developer Name: Mabel Anto Moncy`.

---

## ✨ Features & Assignment Requirements

1. **Add, Edit, and Delete Todos:**
   - Full CRUD operations connected directly to MongoDB Atlas.
   - Interactive modal editor, inline completion toggle, and delete confirmation.
   - Real-time search across tasks and filter by status (All, Active, Completed).
2. **Backend Base URL displays Todo App:**
   - Base URL (`/`) serves the compiled React production client directly.
3. **`/name` Endpoint:**
   - Visiting `BASE_URL/name` returns and displays on screen:
     ```
     Developer Name: Mabel Anto Moncy
     ```
4. **Vercel Monorepo Serverless Architecture:**
   - Serverless API (`api/index.js`) powered by Express and cached Mongoose connection pool.
   - Fast static frontend assets served via Vercel Edge CDN.

---

## 🚀 How to Deploy on Vercel (1-Click Monorepo)

### Step 1: Push Code to GitHub
All code is pushed to your repo: `https://github.com/MabelMoncy/todo_app.git`.

### Step 2: Import into Vercel
1. Go to [Vercel](https://vercel.com) and log in.
2. Click **Add New...** > **Project**.
3. Import `MabelMoncy/todo_app`.
4. Leave **Root Directory** as `./` (Root). Vercel will automatically read `vercel.json`.

### Step 3: Add Environment Variables
Under **Environment Variables**, add:
- `MONGO_URI`: `your_mongodb_atlas_connection_string`
- `DEVELOPER_NAME`: `Mabel Anto Moncy`
- `NODE_ENV`: `production`

### Step 4: Click Deploy!
Vercel will:
1. Build the Vite client into `client/dist`.
2. Deploy the Express API as a high-performance Serverless Function at `/api` and `/name`.
3. Provide your live production URL (e.g., `https://todo-app-mabel.vercel.app`).

---

## 🛠️ Local Development

```bash
# Run server (with MongoDB Atlas connection) and client concurrently
npm run dev
```

- **Backend / Root App:** [http://localhost:5000](http://localhost:5000)
- **Developer Name:** [http://localhost:5000/name](http://localhost:5000/name)
- **Frontend Dev Server:** [http://localhost:5173](http://localhost:5173)
