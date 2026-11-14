# MERN Stack Todo App

A full-stack MERN (MongoDB, Express, React, Node.js) Todo application built for the **Final MERN Stack Assignment**.

---

## 📋 Mandatory Submission Information

- **Developer Name:** Mabel Anto Moncy
- **Live Frontend URL:** `<Insert Deployed Frontend URL (e.g. Vercel)>`
- **Live Backend Base URL:** `<Insert Deployed Backend Base URL (e.g. Render)>`
- **GitHub Repository URL:** [https://github.com/MabelMoncy/todo_app.git](https://github.com/MabelMoncy/todo_app.git)

---

## ✨ Features & Requirements Fulfilled

1. **Add Todos:** Create tasks with a title and optional descriptive notes/links.
2. **Edit Todos:** Modal editor to update task title, description, or mark as completed.
3. **Delete Todos:** Delete unwanted tasks instantly.
4. **Mark Complete / Incomplete:** Interactive checkbox toggle with optimistic UI updates.
5. **Search & Filter:** Real-time search across titles & notes; filter by All, Active, and Completed.
6. **Backend Base URL displays Todo App:**
   - Visiting `BASE_URL/` serves the production React build directly.
7. **Developer Name Endpoint:**
   - Visiting `BASE_URL/name` displays: `Developer Name: Mabel Anto Moncy` on screen.
8. **Independent Database & Backend:**
   - Designed for personal MongoDB Atlas cluster connection and independent cloud deployment.

---

## 📁 Repository Structure

```
todo_app/
├── client/                     # Frontend (React + Vite + Tailwind CSS + Lucide Icons)
│   ├── src/
│   │   ├── components/         # Header, TodoInput, TodoItem, EditModal
│   │   ├── services/           # api.js (Axios API client)
│   │   ├── App.jsx             # Main Todo App component & state management
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vercel.json             # Vercel SPA routing rewrite
│   └── vite.config.js
├── server/                     # Backend (Node.js + Express + Mongoose)
│   ├── config/
│   │   └── db.js               # MongoDB connection logic
│   ├── controllers/
│   │   └── todoController.js   # CRUD operations handler
│   ├── models/
│   │   └── Todo.js             # Mongoose Schema
│   ├── routes/
│   │   └── todoRoutes.js       # /api/todos REST routes
│   ├── .env.example            # Environment variables template
│   ├── package.json
│   └── server.js               # Express server, /name endpoint, static file serving
├── package.json                # Root scripts
└── README.md
```

---

## 🚀 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/name` | Returns and displays `Developer Name: Mabel Anto Moncy` on screen |
| `GET` | `/` | Serves the full Todo App user interface |
| `GET` | `/api/health` | Health check endpoint returning `{ status: "OK" }` |
| `GET` | `/api/todos` | Fetch all todos sorted by newest first |
| `POST` | `/api/todos` | Create a new todo (`title`, optional `description`) |
| `PUT` | `/api/todos/:id` | Update a todo (`title`, `description`, `completed`) |
| `DELETE` | `/api/todos/:id` | Delete a todo by ID |

---

## 💻 Local Development Setup

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas connection string (or local MongoDB running)

### 2. Install Dependencies
```bash
# In server directory
cd server
npm install

# In client directory
cd ../client
npm install
```

### 3. Configure Environment Variables
Inside `server/.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
DEVELOPER_NAME=Mabel Anto Moncy
```

Inside `client/.env.development` (optional, proxy is pre-configured):
```env
VITE_API_URL=http://localhost:5000
```

### 4. Run Locally
In terminal 1 (Backend):
```bash
cd server
npm run dev
```

In terminal 2 (Frontend):
```bash
cd client
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🌐 Cloud Deployment Guide

### Step 1: MongoDB Atlas (Database)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and sign in.
2. Create a free shared cluster (M0).
3. Under **Database Access**, create a user with read/write privileges.
4. Under **Network Access**, add `0.0.0.0/0` (Allow Access from Anywhere).
5. Click **Connect** > **Drivers** > Copy the connection string.
   - Example: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/todo_app?retryWrites=true&w=majority`

---

### Step 2: Deploy Backend (Render)
1. Sign up / Log in to [Render](https://render.com).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository `MabelMoncy/todo_app`.
4. Configure the Web Service:
   - **Name:** `mabel-todo-backend` (or your preferred name)
   - **Root Directory:** *(leave blank to build root)*
   - **Environment:** `Node`
   - **Build Command:**
     ```bash
     npm install --prefix client && npm run build --prefix client && npm install --prefix server
     ```
   - **Start Command:**
     ```bash
     node server/server.js
     ```
5. Add **Environment Variables**:
   - `MONGO_URI`: `<Your MongoDB Atlas connection URI>`
   - `DEVELOPER_NAME`: `Mabel Anto Moncy`
   - `NODE_ENV`: `production`
6. Click **Deploy Web Service**.
7. Once deployed, test:
   - `https://<your-backend-app>.onrender.com/name` -> Displays `Developer Name: Mabel Anto Moncy`
   - `https://<your-backend-app>.onrender.com/` -> Displays the Todo App directly!

---

### Step 3: Deploy Frontend (Vercel)
1. Sign up / Log in to [Vercel](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository `MabelMoncy/todo_app`.
4. Configure:
   - **Root Directory:** Click `Edit` and select `client`.
   - **Framework Preset:** `Vite`.
5. Under **Environment Variables**, add:
   - `VITE_API_URL`: `https://<your-backend-app>.onrender.com`
6. Click **Deploy**.
7. Test the live frontend URL to verify all CRUD actions communicate with the backend.
