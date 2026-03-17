import React, { useState } from "react";
import SymptomChecker from "./SymptomChecker";
import { getPrediction } from "../services/api";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("symptom-checker");
  const [formData, setFormData] = useState({
    Age: "",
    BMI: "",
    BloodPressure: "",
    Cholesterol: "",
    Glucose: "",
    Sex: "0",
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = {
        Age: parseInt(formData.Age),
        BMI: parseFloat(formData.BMI),
        BloodPressure: parseFloat(formData.BloodPressure),
        Cholesterol: parseFloat(formData.Cholesterol),
        Glucose: parseFloat(formData.Glucose),
        Sex: parseInt(formData.Sex),
      };

      const result = await getPrediction(data);
      setPrediction(result);
    } catch (err) {
      setError("Failed to get prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level) => {
    switch (level) {
      case "Low":
        return "text-green-600 bg-green-100";
      case "Medium":
        return "text-yellow-600 bg-yellow-100";
      case "High":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Tabs Navigation */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("symptom-checker")}
          className={`px-6 py-3 font-bold transition border-b-4 ${
            activeTab === "symptom-checker"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-blue-600"
          }`}
        >
          🤖 AI Symptom Checker
        </button>
        <button
          onClick={() => setActiveTab("risk-assessment")}
          className={`px-6 py-3 font-bold transition border-b-4 ${
            activeTab === "risk-assessment"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-blue-600"
          }`}
        >
          💊 Risk Assessment
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "symptom-checker" && <SymptomChecker />}

      {activeTab === "risk-assessment" && (
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
          <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-brand-light to-brand-dark text-white py-2 rounded-lg">
            💊 Health Risk Assessment
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label className="block text-sm font-medium mb-2">Age</label>
              <input
                type="number"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.Age}
                onChange={(e) =>
                  setFormData({ ...formData, Age: e.target.value })
                }
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
                onChange={(e) =>
                  setFormData({ ...formData, BMI: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Blood Pressure (mmHg)
              </label>
              <input
                type="number"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.BloodPressure}
                onChange={(e) =>
                  setFormData({ ...formData, BloodPressure: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Cholesterol (mg/dL)
              </label>
              <input
                type="number"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.Cholesterol}
                onChange={(e) =>
                  setFormData({ ...formData, Cholesterol: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Glucose (mg/dL)
              </label>
              <input
                type="number"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.Glucose}
                onChange={(e) =>
                  setFormData({ ...formData, Glucose: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Gender</label>
              <select
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.Sex}
                onChange={(e) =>
                  setFormData({ ...formData, Sex: e.target.value })
                }
              >
                <option value="0">Female</option>
                <option value="1">Male</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="md:col-span-2 bg-gradient-to-r from-brand-light to-brand-dark text-white py-2 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
            >
              {loading ? "Analyzing..." : "Get Risk Assessment"}
            </button>
          </form>

          {prediction && (
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-blue-500">
              <h3 className="text-xl font-bold mb-4 text-blue-900">
                Assessment Results
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600 font-semibold">Risk Level</p>
                  <p className={`text-2xl font-bold mt-2 ${getRiskColor(prediction.risk_level)}`}>
                    {prediction.risk_level}
                  </p>
                </div>
                {prediction.predictions && (
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600 font-semibold">
                      Probability
                    </p>
                    <p className="text-2xl font-bold mt-2 text-blue-600">
                      {(prediction.predictions * 100).toFixed(1)}%
                    </p>
                  </div>
                )}
              </div>
              <div className="mt-4 p-4 bg-blue-100 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>Note:</strong> This is a preliminary assessment.
                  Please consult with a healthcare professional for a proper
                  diagnosis.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;

