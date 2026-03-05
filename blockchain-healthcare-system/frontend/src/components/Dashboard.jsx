import React, { useState } from 'react';
import { getPrediction } from '../services/api';

function Dashboard() {
  const [formData, setFormData] = useState({
    Age: '',
    BMI: '',
    BloodPressure: '',
    Cholesterol: '',
    Glucose: '',
    Sex: '0'
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = {
        Age: parseInt(formData.Age),
        BMI: parseFloat(formData.BMI),
        BloodPressure: parseFloat(formData.BloodPressure),
        Cholesterol: parseFloat(formData.Cholesterol),
        Glucose: parseFloat(formData.Glucose),
        Sex: parseInt(formData.Sex)
      };

      const result = await getPrediction(data);
      setPrediction(result);
    } catch (err) {
      setError('Failed to get prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level) => {
    switch(level) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">🤖 AI Health Assessment</h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Age</label>
            <input
              type="number"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.Age}
              onChange={(e) => setFormData({...formData, Age: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">BMI</label>
            <input
              type="number"
              step="0.1"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.BMI}
              onChange={(e) => setFormData({...formData, BMI: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Blood Pressure (mmHg)</label>
            <input
              type="number"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.BloodPressure}
              onChange={(e) => setFormData({...formData, BloodPressure: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Cholesterol (mg/dL)</label>
            <input
              type="number"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.Cholesterol}
              onChange={(e) => setFormData({...formData, Cholesterol: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Glucose (mg/dL)</label>
            <input
              type="number"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.Glucose}
              onChange={(e) => setFormData({...formData, Glucose: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Sex</label>
            <select
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.Sex}
              onChange={(e) => setFormData({...formData, Sex: e.target.value})}
            >
              <option value="0">Female</option>
              <option value="1">Male</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : '🔍 Get AI Prediction'}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 bg-red-100 text-red-700 p-4 rounded-lg">
            {error}
          </div>
        )}
      </div>

      {prediction && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Diabetes Prediction */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">🩺 Diabetes Risk</h3>
            <div className={`text-center py-4 rounded-lg mb-4 ${getRiskColor(prediction.predictions.diabetes.risk_level)}`}>
              <p className="text-3xl font-bold">{prediction.predictions.diabetes.risk_level}</p>
              <p className="text-sm">Risk Level</p>
            </div>
            <p className="text-gray-600">Probability: {(prediction.predictions.diabetes.probability * 100).toFixed(1)}%</p>
            
            <div className="mt-4">
              <p className="font-semibold mb-2">Top Risk Factors:</p>
              <ul className="space-y-1 text-sm">
                {Object.entries(prediction.predictions.diabetes.feature_importance).slice(0, 3).map(([key, value]) => (
                  <li key={key} className="flex justify-between">
                    <span>{key}</span>
                    <span className="font-medium">{value.toFixed(3)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Heart Disease Prediction */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">❤️ Heart Disease Risk</h3>
            <div className={`text-center py-4 rounded-lg mb-4 ${getRiskColor(prediction.predictions.heart_disease.risk_level)}`}>
              <p className="text-3xl font-bold">{prediction.predictions.heart_disease.risk_level}</p>
              <p className="text-sm">Risk Level</p>
            </div>
            <p className="text-gray-600">Probability: {(prediction.predictions.heart_disease.probability * 100).toFixed(1)}%</p>
            
            <div className="mt-4">
              <p className="font-semibold mb-2">Top Risk Factors:</p>
              <ul className="space-y-1 text-sm">
                {Object.entries(prediction.predictions.heart_disease.feature_importance).slice(0, 3).map(([key, value]) => (
                  <li key={key} className="flex justify-between">
                    <span>{key}</span>
                    <span className="font-medium">{value.toFixed(3)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Health Score */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">💯 Digital Health Score</h3>
            <div className="text-center">
              <p className="text-6xl font-bold">{prediction.healthScore.overall}</p>
              <p className="text-sm opacity-90">out of 100</p>
            </div>
            <div className="mt-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Clinical Score:</span>
                <span className="font-bold">{prediction.healthScore.clinical}</span>
              </div>
              <div className="flex justify-between">
                <span>AI Risk Score:</span>
                <span className="font-bold">{prediction.healthScore.aiRisk}</span>
              </div>
              <div className="flex justify-between">
                <span>Lifestyle Score:</span>
                <span className="font-bold">{prediction.healthScore.lifestyle}</span>
              </div>
            </div>
          </div>

          {/* Department Recommendation */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">🏥 Recommended Department</h3>
            <div className="text-center py-6">
              <p className="text-3xl font-bold text-blue-600">{prediction.recommendations.department}</p>
              <p className="text-gray-600 mt-2">Priority: {prediction.recommendations.priority}</p>
            </div>
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition mt-4">
              Book Appointment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
