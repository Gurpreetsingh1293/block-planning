"""
SIH Block Planning - Machine Learning Risk Prediction Service
FastAPI microservice for predicting maintenance block operational risk and delay probability.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import datetime

app = FastAPI(
    title="SIH Block Planning ML Service",
    description="Machine Learning & Heuristic Risk Prediction API for Indian Railways Maintenance Windows",
    version="1.0.0",
)

# Enable CORS for local backend and frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Schemas
class RiskPredictionRequest(BaseModel):
    section_id: str = Field(..., example="NDLS-GZB", description="Track section identifier")
    work_type: str = Field(..., example="Track Tamping", description="Maintenance work category")
    requested_duration_min: int = Field(..., ge=15, le=720, example=180, description="Duration in minutes")
    scheduled_hour: Optional[int] = Field(2, ge=0, le=23, description="Hour of day (0-23) block is proposed for")

class RiskFactor(BaseModel):
    name: str
    weight: float
    description: str

class RiskPredictionResponse(BaseModel):
    section_id: str
    risk_score: float = Field(..., description="Calculated risk between 0.0 (safest) and 1.0 (critical)")
    risk_level: str = Field(..., description="Low, Medium, High, or Critical")
    confidence: float = Field(..., description="Model confidence score")
    recommended_window: str = Field(..., description="Optimal recommended time window")
    estimated_passenger_delay_min: int
    factors: List[RiskFactor]
    evaluated_at: str

# In future, load trained scikit-learn pipeline using joblib:
# model = joblib.load("models/block_risk_model.joblib")

@app.get("/")
def read_root():
    return {
        "service": "sih-block-planning-ml",
        "status": "online",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "predict_risk": "/predict-risk",
            "docs": "/docs",
        },
    }

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "ml-service",
        "timestamp": datetime.datetime.utcnow().isoformat(),
    }

@app.post("/predict-risk", response_model=RiskPredictionResponse)
def predict_risk(payload: RiskPredictionRequest):
    """
    Placeholder endpoint returning risk assessment.
    To be replaced with a trained scikit-learn / XGBoost model.
    """
    # Heuristic baseline calculation for demonstration
    base_risk = 0.2
    if payload.requested_duration_min > 240:
        base_risk += 0.3
    if 6 <= payload.scheduled_hour <= 22:
        # Daytime blocks on Indian Railways carry much higher traffic conflict risk
        base_risk += 0.35
    else:
        # Night blocks (00:00 to 05:00) carry lower traffic conflict risk
        base_risk += 0.05

    risk_score = round(min(base_risk, 0.95), 2)

    if risk_score < 0.35:
        risk_level = "Low"
        recommended_window = "01:30 - 04:30 (Night Window)"
        delay_est = 10
    elif risk_score < 0.65:
        risk_level = "Medium"
        recommended_window = "02:00 - 05:00 (Off-Peak)"
        delay_est = 25
    else:
        risk_level = "High"
        recommended_window = "00:30 - 03:30 (Low Density Slot)"
        delay_est = 55

    return RiskPredictionResponse(
        section_id=payload.section_id,
        risk_score=risk_score,
        risk_level=risk_level,
        confidence=0.88,
        recommended_window=recommended_window,
        estimated_passenger_delay_min=delay_est,
        factors=[
            RiskFactor(
                name="Corridor Train Density",
                weight=0.45,
                description=f"High frequency passenger corridor traversing {payload.section_id}",
            ),
            RiskFactor(
                name="Duration Impact",
                weight=0.35,
                description=f"Requested block duration of {payload.requested_duration_min} minutes",
            ),
            RiskFactor(
                name="Time of Day",
                weight=0.20,
                description=f"Proposed schedule at {payload.scheduled_hour:02d}:00 hours",
            ),
        ],
        evaluated_at=datetime.datetime.utcnow().isoformat(),
    )
