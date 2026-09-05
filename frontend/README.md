# 🖥️ SIH Block Planning — Frontend Dashboard

A modern React web dashboard built with **Vite** using **plain JavaScript (JSX)**. It connects to the Express backend to manage track sections, inspect train schedules, review maintenance requests, and visualize automated block planning conflict assessments.

---

## 🚀 Quick Start (Windows)

```powershell
# 1. Navigate to frontend directory
cd frontend

# 2. Copy environment file
copy .env.example .env

# 3. Install dependencies
npm install

# 4. Start Vite development server
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## 📂 Folder Structure

```text
frontend/
├── src/
│   ├── api/
│   │   └── client.js        # Centralized HTTP client for backend endpoints
│   ├── components/
│   │   └── HealthCard.jsx   # Live backend connectivity & status badge card
│   ├── pages/
│   │   └── Dashboard.jsx    # Main monitoring dashboard
│   ├── App.jsx              # Root component
│   ├── index.css            # Dark mode design system, tokens & utility classes
│   └── main.jsx             # React DOM root entry
├── .env.example
├── index.html
├── package.json
├── vercel.json              # Config for one-click Vercel deployment
├── vite.config.js           # Vite configuration with /api proxy
└── README.md
```

---

## ☁️ Deployment to Vercel

1. Push your repository to GitHub.
2. Link your repository in [Vercel](https://vercel.com).
3. Set **Root Directory** to `frontend`.
4. Add environment variable `VITE_API_BASE_URL` pointing to your deployed backend URL on Render.
5. Hit **Deploy**! The included `vercel.json` ensures full SPA routing support.
