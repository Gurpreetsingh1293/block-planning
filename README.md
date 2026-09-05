# SIH Block Planning — Monorepo 🚆

> **Smart India Hackathon (SIH)** project for intelligent Indian Railways Maintenance Block Planning and Traffic Optimization.

This monorepo contains the complete software stack for automated maintenance block scheduling, conflict detection, traffic simulation, and AI-assisted risk prediction.

---

## 📁 Repository Structure

```text
sih-block-planning/
├── backend/          # Express.js REST API, Mongoose models, Anthropic integration
├── frontend/         # React (Vite, plain JavaScript) modern dashboard UI
├── ml-service/       # Python FastAPI service for block risk prediction
├── database/         # MongoDB schema reference documentation & seed script
├── docs/             # System architecture diagrams and REST API contracts
├── GUIDE.md          # 6-Member team onboarding, workflow & standards
├── VERSIONS.md       # Software and library versions catalog with rationales
├── GithubCommands.md # Team Git handbook: conflicts, rebase, branches, undo
├── render.yaml       # Blueprint for deployment on Render
└── .gitignore        # Monorepo-wide ignore rules
```

---

## 🔗 Quick Subproject Navigation

| Component | Technology | Description | Documentation |
| :--- | :--- | :--- | :--- |
| **Backend** | Node.js, Express, Mongoose | Core business logic, DB access, LLM block analysis | [backend/README.md](./backend/README.md) |
| **Frontend** | React 18, Vite (Plain JS) | Responsive traffic & block planning visualizer | [frontend/README.md](./frontend/README.md) |
| **ML Service** | Python, FastAPI, Scikit-Learn | Risk assessment and impact score prediction | [ml-service/README.md](./ml-service/README.md) |
| **Database** | MongoDB, Mongoose | Schema reference & local sample data seeder | [database/README.md](./database/README.md) |
| **Docs** | Architecture & APIs | HTTP flow charts & detailed API contracts | [docs/architecture.md](./docs/architecture.md) |

---

## 👥 Team & Contributor Documentation

- **[GUIDE.md](./GUIDE.md)**: Role distribution for our 6-member team, development etiquette, and PR rules.
- **[GithubCommands.md](./GithubCommands.md)**: Step-by-step instructions for everyday Git commands, branching, resolving merge conflicts, and undoing commits.
- **[VERSIONS.md](./VERSIONS.md)**: Catalog of exact dependencies, runtime versions, and design decisions.

---

## 🚀 Running All Services Locally (Windows)

Open **3 separate PowerShell or Command Prompt terminals** in the project root:

### Terminal 1: Backend Service (Port 5000)
```powershell
cd backend
copy .env.example .env
npm install
npm run dev
```
*Health endpoint:* `http://localhost:5000/api/health`

### Terminal 2: Frontend Dashboard (Port 5173)
```powershell
cd frontend
copy .env.example .env
npm install
npm run dev
```
*App URL:* `http://localhost:5173`

### Terminal 3: Machine Learning Service (Port 8000)
```powershell
cd ml-service
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
*Interactive Swagger Docs:* `http://localhost:8000/docs`

---

## 🗄️ Database Seeding (Optional for Local Testing)

To populate MongoDB with realistic track sections, passenger train timetables, and sample maintenance requests:

```powershell
cd database
copy ../backend/.env.example .env
npm install
node seed.js
```

---

## ☁️ Deployment Guides
- **Frontend**: One-click deploy to [Vercel](https://vercel.com) using [`frontend/vercel.json`](./frontend/vercel.json).
- **Backend & ML Service**: Deploy to [Render](https://render.com) using the included [`render.yaml`](./render.yaml) or standalone Docker containers via each service's `Dockerfile`.
