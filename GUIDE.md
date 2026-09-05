# 📘 Team Collaboration & Onboarding Guide (`GUIDE.md`)

> **Welcome team!** This guide is designed for our **6-member hackathon squad** working on the **sih-block-planning** project.  
> Please read this document thoroughly before writing your first line of code.

---

## 👥 1. Team Role Distribution (6 Members)

To move fast without blocking each other during a hackathon, each member should own a primary domain while coordinating on interfaces:

| Member | Primary Focus | Key Responsibilities | Primary Folder |
| :--- | :--- | :--- | :--- |
| **Member 1** | **Frontend Lead (UI/UX)** | Main Dashboard, Block Planning UI, Navigation, Forms for Maintenance Requests | `/frontend/src/pages/`, `components/` |
| **Member 2** | **Frontend (Data & Gantt)** | Visual timetable charts (train schedules vs block windows), map/track visualization | `/frontend/src/components/` |
| **Member 3** | **Backend Core & Database** | Express endpoints for Sections, Trains, Maintenance Requests, Mongo integration | `/backend/src/routes/`, `controllers/`, `/database/` |
| **Member 4** | **Backend Logic & Scheduling Engine** | Block allocation algorithm, train conflict detection logic, scheduling heuristics | `/backend/src/services/` |
| **Member 5** | **Machine Learning Lead** | Python FastAPI service, feature engineering, risk classification model, ML API | `/ml-service/` |
| **Member 6** | **LLM Integration & DevOps** | Anthropic Claude AI integration for block report generation, Docker/Render deploy, testing | `/backend/src/services/`, Root configs |

---

## ⚙️ 2. Prerequisite Setup on Windows

Ensure each member has the following installed on their Windows machine:

1. **Node.js (v20+ LTS or v24)**: [Download Node.js](https://nodejs.org/)
   - Check in terminal: `node -v` and `npm -v`
2. **Python (3.10 to 3.14)**: [Download Python](https://www.python.org/)
   - *Important during install:* Check the box **"Add python.exe to PATH"**
   - Check in terminal: `python --version`
3. **Git for Windows**: [Download Git](https://git-scm.com/download/win)
   - Check in terminal: `git --version`
4. **MongoDB Community Server** (or a free **MongoDB Atlas** cloud cluster URI):
   - Local install: [Download Community Server](https://www.mongodb.com/try/download/community) and Compass GUI.
   - Alternatively: Share a single MongoDB Atlas connection string in team `.env` files.

---

## 🛠️ 3. First-Time Repository Setup

Clone or pull the repository, then run the setup in each component folder:

```powershell
# 1. Backend Setup
cd backend
copy .env.example .env
npm install

# 2. Frontend Setup
cd ..\frontend
copy .env.example .env
npm install

# 3. ML Service Setup
cd ..\ml-service
copy .env.example .env
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt

# Return to root
cd ..
```

---

## 🌿 4. Git & Branching Rules (How We Collaborate)

To avoid breaking working code, follow these strict rules:

### Rule 1: Never Commit Directly to `main`
- `main` is our production-ready branch. It should always boot without errors.
- Always create a feature branch off `main` for your work.

### Rule 2: Branch Naming Convention
Use descriptive prefixes:
- `feature/<name>-<feature-description>` (e.g., `feature/mark-train-gantt-chart`)
- `fix/<name>-<bug-description>` (e.g., `fix/priya-cors-origin`)
- `ml/<name>-<model-name>` (e.g., `ml/rohit-risk-classifier`)

### Rule 3: Daily Sync Workflow
Before starting new code each day/session:
```powershell
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

Before opening a Pull Request:
```powershell
# Save and commit your work
git add .
git commit -m "feat(ui): add schedule conflict banner"

# Pull latest main and rebase or merge
git checkout main
git pull origin main
git checkout feature/your-feature-name
git merge main

# Test that everything still runs, then push
git push origin feature/your-feature-name
```

---

## 📜 5. Code Standards

### No TypeScript
- **Plain JavaScript only** across backend, frontend, and database scripts.
- Use modern ES6+ features: `const`/`let`, arrow functions, template literals, destructuring, and `async`/`await`.

### Backend Standards
- **CommonJS** is standard in `/backend`: use `const express = require('express')` and `module.exports = ...`.
- Always wrap asynchronous controller handlers in `try / catch` blocks and return structured JSON:
  ```javascript
  // Good: Consistent API responses
  res.status(200).json({ success: true, data: results });
  res.status(400).json({ success: false, error: error.message });
  ```

### Frontend Standards
- Component filenames should be PascalCase: e.g. `HealthCard.jsx`, `ScheduleView.jsx`.
- Store API requests in `/src/api/` instead of hardcoding `fetch()` URLs directly inside JSX components.
- Use Vanilla CSS or custom CSS modules for styling. Maintain a sleek dark aesthetic.

### Machine Learning Standards
- Keep endpoints fast: keep heavy model loading at startup using FastAPI lifespan/module scope, not inside route functions.
- All request/response payloads in `main.py` should be validated using **Pydantic** models.

---

## 🔐 6. Environment & Secret Hygiene

- **NEVER COMMIT `.env` FILES TO GIT.**
- Whenever you add a new environment variable (e.g., `JWT_SECRET`, `NEW_SERVICE_PORT`):
  1. Add it to your local `.env`.
  2. Add the placeholder with an explanation to `.env.example`.
  3. Inform the team on our group chat so others can update their local `.env`.

---

## 💬 7. Team Communication Checklist

1. **Before modifying shared code** (e.g., `backend/src/routes/index.js` or `database/models`):
   - Ping the team in chat so everyone knows a schema change is occurring.
2. **If you encounter a merge conflict**:
   - Don't panic. Check [GithubCommands.md](./GithubCommands.md) section on Merge Conflicts.
   - Do NOT force push (`git push -f`) without team consent.
3. **Definition of Done for a PR**:
   - Code runs without crashing.
   - Linter/syntax is clean.
   - Verified that `http://localhost:5000/api/health` and `http://localhost:5173` both work.
