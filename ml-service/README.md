# 🧠 SIH Block Planning — Machine Learning Service

Python **FastAPI** microservice providing delay probability forecasting and risk estimation for maintenance block allocation on Indian Railways corridors.

---

## 🚀 Quick Start (Local Setup on Windows)

```powershell
# 1. Navigate to ml-service folder
cd ml-service

# 2. Create Python virtual environment
python -m venv venv

# 3. Activate the virtual environment
.\venv\Scripts\activate

# 4. Install required dependencies
pip install -r requirements.txt

# 5. Start development server with hot-reload
uvicorn main:app --reload --port 8000
```

The service will be active at:
- **API Root**: `http://localhost:8000`
- **Interactive Swagger Docs**: `http://localhost:8000/docs`
- **Alternative ReDoc**: `http://localhost:8000/redoc`

---

## 📡 API Endpoints

### 1. `GET /health`
Returns service status heartbeat.

### 2. `POST /predict-risk`
Evaluates corridor congestion and returns calculated risk metrics.

#### Sample Request:
```json
{
  "section_id": "NDLS-GZB",
  "work_type": "Track Tamping",
  "requested_duration_min": 180,
  "scheduled_hour": 2
}
```

#### Sample Response:
```json
{
  "section_id": "NDLS-GZB",
  "risk_score": 0.25,
  "risk_level": "Low",
  "confidence": 0.88,
  "recommended_window": "01:30 - 04:30 (Night Window)",
  "estimated_passenger_delay_min": 10,
  "factors": [
    {
      "name": "Corridor Train Density",
      "weight": 0.45,
      "description": "High frequency passenger corridor traversing NDLS-GZB"
    }
  ],
  "evaluated_at": "2026-09-05T10:00:00Z"
}
```

---

## 🛠️ Replacing the Placeholder with a Trained Model

Team members working on the ML model should:
1. Train a model with `scikit-learn` on historical block delay records.
2. Serialize it with `joblib.dump(pipeline, "models/block_risk_model.joblib")`.
3. Load the model in `main.py` using `joblib.load()` and replace the heuristic calculation inside `predict_risk()`.
