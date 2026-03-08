import React, { useState, useEffect } from "react";
import { getHealthScore } from "../services/api";

function HealthScore() {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHealthScore();
  }, []);

  const fetchHealthScore = async () => {
    try {
      const data = await getHealthScore();
      setHealthData(data);
    } catch (error) {
      console.error("Failed to fetch health score");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!healthData) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <p className="text-gray-600 mb-4">No health data available</p>
        <p className="text-sm text-gray-500">
          Complete an AI health assessment to see your score
        </p>
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Overall Score */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl shadow-lg p-8 animate-float">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Your Digital Health Score
        </h2>
        <div className="text-center">
          <div className="inline-block">
            <div className="relative">
              <svg className="w-48 h-48">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="white"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${(healthData.healthScore.overall / 100) * 553} 553`}
                  strokeLinecap="round"
                  transform="rotate(-90 96 96)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div>
                  <p className="text-6xl font-bold">
                    {healthData.healthScore.overall}
                  </p>
                  <p className="text-sm opacity-90">out of 100</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="text-center mt-4 opacity-90">
          Last updated: {new Date(healthData.date).toLocaleDateString()}
        </p>
      </div>

      {/* Score Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">🏥 Clinical Score</h3>
          <div className="text-center">
            <p
              className={`text-5xl font-bold ${getScoreColor(healthData.healthScore.clinical)}`}
            >
              {healthData.healthScore.clinical}
            </p>
            <p className="text-gray-600 mt-2">Based on vitals</p>
          </div>
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600">Weight: 40%</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: "40%" }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">🤖 AI Risk Score</h3>
          <div className="text-center">
            <p
              className={`text-5xl font-bold ${getScoreColor(healthData.healthScore.aiRisk)}`}
            >
              {healthData.healthScore.aiRisk}
            </p>
            <p className="text-gray-600 mt-2">Disease risk analysis</p>
          </div>
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600">Weight: 40%</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div
                className="bg-purple-600 h-2 rounded-full"
                style={{ width: "40%" }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">🏃 Lifestyle Score</h3>
          <div className="text-center">
            <p
              className={`text-5xl font-bold ${getScoreColor(healthData.healthScore.lifestyle)}`}
            >
              {healthData.healthScore.lifestyle}
            </p>
            <p className="text-gray-600 mt-2">Activity & habits</p>
          </div>
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600">Weight: 20%</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: "20%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">🩺 Diabetes Risk</h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Risk Level:</span>
            <span
              className={`font-bold px-3 py-1 rounded-full text-sm ${
                healthData.predictions.diabetes.risk_level === "Low"
                  ? "bg-green-100 text-green-700"
                  : healthData.predictions.diabetes.risk_level === "Medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
              }`}
            >
              {healthData.predictions.diabetes.risk_level}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full ${
                healthData.predictions.diabetes.risk_level === "Low"
                  ? "bg-green-500"
                  : healthData.predictions.diabetes.risk_level === "Medium"
                    ? "bg-yellow-500"
                    : "bg-red-500"
              }`}
              style={{
                width: `${healthData.predictions.diabetes.probability * 100}%`,
              }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Probability:{" "}
            {(healthData.predictions.diabetes.probability * 100).toFixed(1)}%
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">❤️ Heart Disease Risk</h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Risk Level:</span>
            <span
              className={`font-bold px-3 py-1 rounded-full text-sm ${
                healthData.predictions.heartDisease.risk_level === "Low"
                  ? "bg-green-100 text-green-700"
                  : healthData.predictions.heartDisease.risk_level === "Medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
              }`}
            >
              {healthData.predictions.heartDisease.risk_level}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full ${
                healthData.predictions.heartDisease.risk_level === "Low"
                  ? "bg-green-500"
                  : healthData.predictions.heartDisease.risk_level === "Medium"
                    ? "bg-yellow-500"
                    : "bg-red-500"
              }`}
              style={{
                width: `${healthData.predictions.heartDisease.probability * 100}%`,
              }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Probability:{" "}
            {(healthData.predictions.heartDisease.probability * 100).toFixed(1)}
            %
          </p>
        </div>
      </div>
    </div>
  );
}

export default HealthScore;
