from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import shap
import joblib
from typing import Dict, List

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load pre-trained model (replace with your actual model)
# model = joblib.load('disease_model.pkl')

class HealthData(BaseModel):
    age: float
    blood_pressure: float
    bmi: float
    cholesterol: float
    sugar_level: float

class PredictionResponse(BaseModel):
    disease: str
    risk_percentage: float
    feature_importance: Dict[str, float]
    explanation_text: str
    shap_values: List[float]

# Mock model for demonstration
def predict_disease(features: np.ndarray):
    # Replace with actual model.predict_proba()
    risk = min(100, max(0, features[0][4] * 0.5 + features[0][2] * 2))
    return "Diabetes", risk

def get_shap_explanation(features: np.ndarray, feature_names: List[str]):
    # Replace with actual SHAP explainer
    # explainer = shap.TreeExplainer(model)
    # shap_values = explainer.shap_values(features)
    
    # Mock SHAP values
    shap_values = [0.05, 0.12, 0.35, 0.18, 0.42]
    
    feature_importance = {
        name: float(abs(val)) for name, val in zip(feature_names, shap_values)
    }
    
    return shap_values, feature_importance

@app.post("/predict", response_model=PredictionResponse)
def predict(data: HealthData):
    feature_names = ["age", "blood_pressure", "bmi", "cholesterol", "sugar_level"]
    features = np.array([[data.age, data.blood_pressure, data.bmi, 
                          data.cholesterol, data.sugar_level]])
    
    disease, risk = predict_disease(features)
    shap_values, feature_importance = get_shap_explanation(features, feature_names)
    
    # Generate explanation text
    sorted_features = sorted(feature_importance.items(), key=lambda x: x[1], reverse=True)
    top_factors = [f[0].replace('_', ' ') for f in sorted_features[:2]]
    
    explanation = f"Your {disease.lower()} risk is {risk:.0f}%. The main contributing factors are {top_factors[0]} and {top_factors[1]}."
    
    return PredictionResponse(
        disease=disease,
        risk_percentage=round(risk, 2),
        feature_importance=feature_importance,
        explanation_text=explanation,
        shap_values=shap_values
    )

@app.get("/health")
def health_check():
    return {"status": "healthy"}
