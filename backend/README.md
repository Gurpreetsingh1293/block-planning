# 🚂 SIH Block Planning — Backend Service

Express.js REST API server connecting to MongoDB, integrating with the Python ML Service, and calling Anthropic Claude for intelligent maintenance block planning.

---

## 🚀 Quick Start (Local Development on Windows)

```powershell
# 1. Navigate to backend directory
cd backend

# 2. Copy environment file
copy .env.example .env

# 3. Install dependencies
npm install

# 4. Start development server with live reload
npm run dev
```

The server will boot on `http://localhost:5000`.

---

## 📡 Key Routes

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status, MongoDB connection state, and uptime |
| `GET` | `/api/sections` | Fetch railway track sections (defined in MongoDB) |
| `GET` | `/api/train-schedules` | Fetch passenger and freight train schedules |
| `GET` | `/api/maintenance-requests` | List registered maintenance block requests |
| `POST` | `/api/maintenance-requests` | Submit a new maintenance block requirement |
| `POST` | `/api/block-plans/generate` | Generate automated block plan schedule & run risk assessment |

---

## 🏗️ Folder Structure

```text
backend/
├── src/
│   ├── config/
│   │   └── db.js            # Mongoose connection logic with error handling
│   ├── controllers/
│   │   └── health.controller.js
│   ├── models/              # Mongoose schemas
│   │   ├── Section.js
│   │   ├── TrainSchedule.js
│   │   ├── MaintenanceRequest.js
│   │   ├── GoodsForecast.js
│   │   └── BlockPlan.js
│   ├── routes/
│   │   ├── index.js         # Master router aggregating all endpoints
│   │   └── health.routes.js
│   ├── services/
│   │   ├── ml.service.js    # Axios client to talk to Python FastAPI ML service
│   │   └── blockPlan.service.js
│   └── server.js            # Express application bootstrap
├── .env.example
├── Dockerfile
├── package.json
└── README.md
```
