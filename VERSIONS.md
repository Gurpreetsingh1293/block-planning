# 📦 Software & Dependency Versions Catalog (`VERSIONS.md`)

This document records the exact runtime versions and core packages used across the **sih-block-planning** monorepo, along with the technical rationale for why each was chosen.

---

## 🖥️ System Runtimes

| Software | Version Installed / Target | Why This Version? |
| :--- | :--- | :--- |
| **Node.js** | **v24.14.1** (Compatible with v20+ LTS) | Provides native support for modern JavaScript (ES2023+), Fetch API, fast V8 engine execution, and high I/O throughput for Express. |
| **npm** | **v11.11.0** | Native package manager bundled with Node. Provides fast parallel dependency resolution and workspaces support if needed. |
| **Python** | **3.14.4** (Compatible with 3.10+) | Clean async support, high performance, and full compatibility with FastAPI, Pydantic v2, and Scikit-learn. |
| **Git** | **v2.53.0.windows.2** | Reliable version control with full Windows long-path and credential manager support. |

---

## ⚡ Backend Dependencies (`/backend`)

| Package | Version | Purpose & Rationale |
| :--- | :--- | :--- |
| `express` | `^4.19.2` | Minimalist, unopinionated web framework for Node.js. It has the largest ecosystem of middleware and zero steep learning curve for our 6-person team. |
| `mongoose` | `^8.4.0` | Object Data Modeling (ODM) library for MongoDB. Provides strict schema validation, type casting, middleware hooks, and native Promises. |
| `dotenv` | `^16.4.5` | Loads environment variables from `.env` into `process.env`. Ensures API keys and database credentials are never committed. |
| `cors` | `^2.8.5` | Cross-Origin Resource Sharing middleware. Essential to allow the Vite frontend (`localhost:5173`) to call the Express backend (`localhost:5000`). |
| `axios` | `^1.7.2` | Promise-based HTTP client for backend-to-backend communication (e.g., Express querying the FastAPI ML service). |
| `@anthropic-ai/sdk` | `^0.26.0` | Official Anthropic SDK to call Claude models (e.g. Claude 3.5 Sonnet) for generating human-readable block planning summaries, conflict mitigation advice, and incident explanations. |
| `nodemon` *(dev)* | `^3.1.2` | Development tool that automatically restarts the Node application when file changes in the directory are detected, boosting developer velocity. |

---

## ⚛️ Frontend Dependencies (`/frontend`)

| Package | Version | Purpose & Rationale |
| :--- | :--- | :--- |
| `react` | `^18.3.1` | Battle-tested, stable React version. Supports concurrent features, hooks, and clean component-driven state management. |
| `react-dom` | `^18.3.1` | DOM-specific methods used at the top level of the React web app. |
| `vite` | `^5.3.1` | Next-generation frontend tooling offering near-instant cold server start and blazing fast Hot Module Replacement (HMR) during hackathons. |
| `@vitejs/plugin-react` | `^4.3.1` | Enables Fast Refresh and JSX transformation with zero configuration needed. |
| `lucide-react` | `^0.395.0` | Clean, modern feather-style SVG icon set. Tree-shakeable and visually aligns with modern railway control dashboard design. |

---

## 🧠 Machine Learning Dependencies (`/ml-service`)

| Package | Version | Purpose & Rationale |
| :--- | :--- | :--- |
| `fastapi` | `^0.111.0` | Modern, high-performance async web framework for building APIs with Python. Automatically produces interactive Swagger documentation (`/docs`). |
| `uvicorn[standard]` | `^0.30.1` | Lightning-fast ASGI server implementation for Python based on `uvloop` and `httptools`. |
| `pydantic` | `^2.7.4` | Data parsing and validation library using Python type annotations. Automatically validates input JSON for `/predict-risk`. |
| `scikit-learn` | `^1.5.0` | Robust machine learning library for predictive data analysis. Ideal for training tabular risk estimation models (Random Forest, Gradient Boosting). |
| `pandas` | `^2.2.2` | High-performance data manipulation and analysis tool for railway timetable matrices and historical block delay logs. |
| `numpy` | `^1.26.4` | Fundamental package for numerical computing with multi-dimensional array processing. |
| `joblib` | `^1.4.2` | Optimized serialization/deserialization for scikit-learn models, enabling fast in-memory model loading in FastAPI. |

---

## 🚫 Why Plain JavaScript (No TypeScript)?

1. **Hackathon Agility**: Plain JavaScript eliminates TypeScript compilation errors, type mismatches, and `tsconfig.json` debugging during time-pressured hackathon sprints.
2. **Accessible for Mixed-Skill Teams**: In a 6-member team, varying levels of TypeScript familiarity can create friction and slow down contributions. Plain JS allows all members to contribute immediately.
3. **Zero Build Step in Backend**: The backend runs directly in Node without requiring `ts-node`, `tsc`, or `tsx` overhead.
4. **Native Node.js & Vite Support**: Both modern Node (v20+) and Vite have first-class support for ES2022+ features (optional chaining `?.`, nullish coalescing `??`, dynamic imports) without transpilation lag.
