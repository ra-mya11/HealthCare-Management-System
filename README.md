# Explainable AI Healthcare Chatbot

## Architecture

```
Frontend (React) → Spring Boot API → Python FastAPI → ML Model + SHAP
                                                    ↓
                                                MongoDB
```

## Setup

### 1. Python AI Service
```bash
cd ai-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 2. Spring Boot Backend
```bash
cd backend
./mvnw spring-boot:run
```

### 3. React Frontend
```bash
cd frontend
npm install
npm start
```

## API Response Format

```json
{
  "disease": "Diabetes",
  "riskPercentage": 72.5,
  "featureImportance": {
    "age": 0.05,
    "blood_pressure": 0.12,
    "bmi": 0.35,
    "cholesterol": 0.18,
    "sugar_level": 0.42
  },
  "explanationText": "Your diabetes risk is 72%. The main contributing factors are sugar level and bmi.",
  "shapValues": [0.05, 0.12, 0.35, 0.18, 0.42]
}
```

## Usage

1. Click the chat icon (bottom right)
2. Enter health parameters
3. Click "Analyze"
4. View prediction with SHAP explanation chart

## Features

- Floating chatbot widget
- Real-time disease risk prediction
- SHAP-based explainability
- Visual feature importance chart
- Color-coded SHAP values (red=increases risk, green=decreases risk)
