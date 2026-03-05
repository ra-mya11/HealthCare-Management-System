from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
from typing import List

app = FastAPI(title="AI Disease Prediction API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models
try:
    diabetes_model = joblib.load('models/diabetes_model.pkl')
    diabetes_scaler = joblib.load('models/diabetes_scaler.pkl')
    heart_model = joblib.load('models/heart_model.pkl')
    heart_scaler = joblib.load('models/heart_scaler.pkl')
    hypertension_model = joblib.load('models/hypertension_model.pkl')
    hypertension_scaler = joblib.load('models/hypertension_scaler.pkl')
    print("✓ All models loaded successfully")
except Exception as e:
    print(f"Error loading models: {e}")

class PatientData(BaseModel):
    age: int
    bp_systolic: int
    bp_diastolic: int
    sugar_level: float
    bmi: float
    cholesterol: int
    symptoms: List[str] = []

class PredictionResponse(BaseModel):
    diabetes_risk: float
    heart_disease_risk: float
    hypertension_risk: float
    diabetes_prediction: str
    heart_disease_prediction: str
    hypertension_prediction: str
    overall_risk: str
    recommendations: List[str]

@app.get("/")
def root():
    return {"message": "AI Disease Prediction API", "status": "running"}

@app.post("/predict", response_model=PredictionResponse)
def predict_disease(patient: PatientData):
    try:
        # Prepare features
        features = np.array([[
            patient.age,
            patient.bp_systolic,
            patient.bp_diastolic,
            patient.sugar_level,
            patient.bmi,
            patient.cholesterol
        ]])
        
        # Diabetes prediction
        features_diabetes = diabetes_scaler.transform(features)
        diabetes_prob = diabetes_model.predict_proba(features_diabetes)[0][1]
        diabetes_pred = "High Risk" if diabetes_prob > 0.5 else "Low Risk"
        
        # Heart disease prediction
        features_heart = heart_scaler.transform(features)
        heart_prob = heart_model.predict_proba(features_heart)[0][1]
        heart_pred = "High Risk" if heart_prob > 0.5 else "Low Risk"
        
        # Hypertension prediction
        features_hypertension = hypertension_scaler.transform(features)
        hypertension_prob = hypertension_model.predict_proba(features_hypertension)[0][1]
        hypertension_pred = "High Risk" if hypertension_prob > 0.5 else "Low Risk"
        
        # Overall risk
        avg_risk = (diabetes_prob + heart_prob + hypertension_prob) / 3
        if avg_risk > 0.7:
            overall = "High Risk"
        elif avg_risk > 0.4:
            overall = "Moderate Risk"
        else:
            overall = "Low Risk"
        
        # Recommendations
        recommendations = []
        if diabetes_prob > 0.5:
            recommendations.append("Monitor blood sugar levels regularly")
            recommendations.append("Maintain healthy diet low in sugar")
        if heart_prob > 0.5:
            recommendations.append("Reduce cholesterol intake")
            recommendations.append("Regular cardiovascular exercise")
        if hypertension_prob > 0.5:
            recommendations.append("Reduce sodium intake")
            recommendations.append("Monitor blood pressure daily")
        if patient.bmi > 30:
            recommendations.append("Weight management recommended")
        if not recommendations:
            recommendations.append("Maintain healthy lifestyle")
            recommendations.append("Regular health checkups")
        
        return PredictionResponse(
            diabetes_risk=round(diabetes_prob * 100, 2),
            heart_disease_risk=round(heart_prob * 100, 2),
            hypertension_risk=round(hypertension_prob * 100, 2),
            diabetes_prediction=diabetes_pred,
            heart_disease_prediction=heart_pred,
            hypertension_prediction=hypertension_pred,
            overall_risk=overall,
            recommendations=recommendations
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {"status": "healthy", "models_loaded": True}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
