import React, { useState, useEffect } from "react";
import { getRecommendations } from "../services/api";

function Recommendations() {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const data = await getRecommendations();
      setRecommendations(data);
    } catch (error) {
      console.error("Failed to fetch recommendations");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading recommendations...</div>;
  }

  if (!recommendations) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <p className="text-gray-600">No recommendations available</p>
        <p className="text-sm text-gray-500 mt-2">
          Complete a health assessment to get personalized recommendations
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-bold">💡 Personalized Recommendations</h2>

      {/* Department Recommendation */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-md p-6 animate-float">
        <h3 className="text-xl font-semibold mb-2">
          🏥 Recommended Department
        </h3>
        <p className="text-3xl font-bold mb-2">{recommendations.department}</p>
        <p className="opacity-90">
          Based on your health assessment and risk factors
        </p>
        <button className="mt-4 bg-white text-blue-600 px-6 py-2 rounded-lg hover:bg-gray-100 transition font-medium">
          Book Appointment
        </button>
      </div>

      {/* Diet Plan */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          🥗 Personalized Diet Plan
        </h3>
        {recommendations.diet && recommendations.diet.length > 0 ? (
          <div className="space-y-3">
            {recommendations.diet.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-green-50 rounded-lg"
              >
                <span className="text-green-600 text-xl">✓</span>
                <p className="flex-1 text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">
            No specific diet recommendations at this time
          </p>
        )}

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium text-blue-900">💡 Pro Tip</p>
          <p className="text-sm text-blue-800 mt-1">
            Maintain a food diary to track your nutrition and share it with your
            doctor during consultations.
          </p>
        </div>
      </div>

      {/* Exercise Plan */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          🏃 Exercise Recommendations
        </h3>
        {recommendations.exercise && recommendations.exercise.length > 0 ? (
          <div className="space-y-3">
            {recommendations.exercise.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg"
              >
                <span className="text-purple-600 text-xl">💪</span>
                <p className="flex-1 text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">
            No specific exercise recommendations at this time
          </p>
        )}

        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm font-medium text-yellow-900">⚠️ Important</p>
          <p className="text-sm text-yellow-800 mt-1">
            Always consult your doctor before starting a new exercise program,
            especially if you have existing health conditions.
          </p>
        </div>
      </div>

      {/* Reminders */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          ⏰ Daily Reminders
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border-2 border-blue-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">💊</span>
              <span className="text-sm font-medium text-blue-600">Daily</span>
            </div>
            <h4 className="font-semibold">Medication Reminder</h4>
            <p className="text-sm text-gray-600 mt-1">
              Take prescribed medications
            </p>
            <p className="text-xs text-gray-500 mt-2">⏰ 08:00 AM</p>
          </div>

          <div className="p-4 border-2 border-green-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">🥗</span>
              <span className="text-sm font-medium text-green-600">Daily</span>
            </div>
            <h4 className="font-semibold">Healthy Breakfast</h4>
            <p className="text-sm text-gray-600 mt-1">Follow your diet plan</p>
            <p className="text-xs text-gray-500 mt-2">⏰ 08:30 AM</p>
          </div>

          <div className="p-4 border-2 border-purple-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">🏃</span>
              <span className="text-sm font-medium text-purple-600">Daily</span>
            </div>
            <h4 className="font-semibold">Morning Exercise</h4>
            <p className="text-sm text-gray-600 mt-1">
              30 minutes physical activity
            </p>
            <p className="text-xs text-gray-500 mt-2">⏰ 06:00 AM</p>
          </div>

          <div className="p-4 border-2 border-red-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">🩺</span>
              <span className="text-sm font-medium text-red-600">Daily</span>
            </div>
            <h4 className="font-semibold">Health Check</h4>
            <p className="text-sm text-gray-600 mt-1">
              Monitor vitals (BP, Sugar)
            </p>
            <p className="text-xs text-gray-500 mt-2">⏰ 09:00 AM</p>
          </div>
        </div>

        <button className="w-full mt-4 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition">
          Customize Reminders
        </button>
      </div>

      {/* Lifestyle Tips */}
      <div className="bg-gradient-to-br from-green-400 to-blue-500 text-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">🌟 Lifestyle Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💧</span>
            <div>
              <p className="font-medium">Stay Hydrated</p>
              <p className="text-sm opacity-90">
                Drink 8 glasses of water daily
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">😴</span>
            <div>
              <p className="font-medium">Quality Sleep</p>
              <p className="text-sm opacity-90">Get 7-8 hours of sleep</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🧘</span>
            <div>
              <p className="font-medium">Stress Management</p>
              <p className="text-sm opacity-90">Practice meditation or yoga</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🚭</span>
            <div>
              <p className="font-medium">Avoid Smoking</p>
              <p className="text-sm opacity-90">Quit smoking and alcohol</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Recommendations;
