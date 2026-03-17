import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { removeToken } from "../utils/auth";
import UserManagement from "../components/admin/UserManagement";
import DepartmentManagement from "../components/admin/DepartmentManagement";
import AppointmentMonitoring from "../components/admin/AppointmentMonitoring";
import NotificationManagement from "../components/admin/NotificationManagement";
import DoctorManagement from "../components/admin/DoctorManagement";
import MedicalRecordsMonitoring from "../components/admin/MedicalRecordsMonitoring";
import AIPredictionLogs from "../components/admin/AIPredictionLogs";
import { fetchAnalytics } from "../services/adminApi";

function AdminDashboard({ setAuth }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [analytics, setAnalytics] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    totalRecords: 0,
    totalPredictions: 0,
    diabetesPredictions: 0,
    heartPredictions: 0,
    scheduledAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
  });
  const [user, setUser] = useState(null);

  // tab class helpers
  const activeTabClass = "border-b-2 border-brand-dark text-brand-dark";
  const inactiveTabClass = "text-gray-600 hover:text-brand-dark";
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const data = await fetchAnalytics();
      setAnalytics({
        totalPatients: data.totalPatients || 0,
        totalDoctors: data.totalDoctors || 0,
        totalAppointments: data.totalAppointments || 0,
        totalRecords: data.totalRecords || 0,
        totalPredictions: data.totalPredictions || 0,
        diabetesPredictions: data.diabetesPredictions || 0,
        heartPredictions: data.heartPredictions || 0,
        scheduledAppointments: data.scheduledAppointments || 0,
        completedAppointments: data.completedAppointments || 0,
        cancelledAppointments: data.cancelledAppointments || 0,
      });
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    }
  };

  const handleLogout = () => {
    removeToken();
    localStorage.removeItem("user");
    setAuth(false);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-brand-dark to-brand-light text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">⚙️ Admin Portal</h1>
            <p className="text-sm opacity-90">Healthcare System Management</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold">{user?.name || "Administrator"}</p>
              <p className="text-sm opacity-90">System Admin</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-white text-brand px-4 py-2 rounded-lg hover:bg-gray-100 transition font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-6 py-3 font-medium transition whitespace-nowrap ${
                activeTab === "overview" ? activeTabClass : inactiveTabClass
              }`}
            >
              📊 Overview
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`px-6 py-3 font-medium transition whitespace-nowrap ${
                activeTab === "users" ? activeTabClass : inactiveTabClass
              }`}
            >
              👥 Users
            </button>
            <button
              onClick={() => setActiveTab("doctors")}
              className={`px-6 py-3 font-medium transition whitespace-nowrap ${
                activeTab === "doctors" ? activeTabClass : inactiveTabClass
              }`}
            >
              👨‍⚕️ Doctors
            </button>
            <button
              onClick={() => setActiveTab("departments")}
              className={`px-6 py-3 font-medium transition whitespace-nowrap ${
                activeTab === "departments" ? activeTabClass : inactiveTabClass
              }`}
            >
              🏥 Departments
            </button>
            <button
              onClick={() => setActiveTab("appointments")}
              className={`px-6 py-3 font-medium transition whitespace-nowrap ${
                activeTab === "appointments" ? activeTabClass : inactiveTabClass
              }`}
            >
              📅 Appointments
            </button>
            <button
              onClick={() => setActiveTab("records")}
              className={`px-6 py-3 font-medium transition whitespace-nowrap ${
                activeTab === "records" ? activeTabClass : inactiveTabClass
              }`}
            >
              📋 Records
            </button>
            <button
              onClick={() => setActiveTab("ai")}
              className={`px-6 py-3 font-medium transition whitespace-nowrap ${
                activeTab === "ai" ? activeTabClass : inactiveTabClass
              }`}
            >
              🤖 AI Logs
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`px-6 py-3 font-medium transition whitespace-nowrap ${
                activeTab === "notifications"
                  ? activeTabClass
                  : inactiveTabClass
              }`}
            >
              🔔 Notifications
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">System Overview</h2>
              <button
                onClick={fetchAnalyticsData}
                className="bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand-dark transition"
              >
                🔄 Refresh
              </button>
            </div>

            {/* Main Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-4">
                <p className="text-sm opacity-90">Total Patients</p>
                <p className="text-3xl font-bold mt-2">
                  {analytics.totalPatients}
                </p>
                <div className="text-4xl opacity-60">👥</div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg p-4">
                <p className="text-sm opacity-90">Total Doctors</p>
                <p className="text-3xl font-bold mt-2">
                  {analytics.totalDoctors}
                </p>
                <div className="text-4xl opacity-60">👨‍⚕️</div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg p-4">
                <p className="text-sm opacity-90">Total Appointments</p>
                <p className="text-3xl font-bold mt-2">
                  {analytics.totalAppointments}
                </p>
                <div className="text-4xl opacity-60">📅</div>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl shadow-lg p-4">
                <p className="text-sm opacity-90">Medical Records</p>
                <p className="text-3xl font-bold mt-2">
                  {analytics.totalRecords}
                </p>
                <div className="text-4xl opacity-60">📋</div>
              </div>

              <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-xl shadow-lg p-4">
                <p className="text-sm opacity-90">AI Predictions</p>
                <p className="text-3xl font-bold mt-2">
                  {analytics.totalPredictions}
                </p>
                <div className="text-4xl opacity-60">🤖</div>
              </div>
            </div>

            {/* AI Usage Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold mb-4">
                  AI Predictions Breakdown
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Predictions:</span>
                    <span className="font-bold text-lg">
                      {analytics.totalPredictions}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Diabetes:</span>
                    <span className="font-medium text-red-600">
                      {analytics.diabetesPredictions}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Heart Disease:</span>
                    <span className="font-medium text-blue-600">
                      {analytics.heartPredictions}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold mb-4">
                  Appointment Status Distribution
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Scheduled:</span>
                    <span className="font-medium text-blue-600">
                      {analytics.scheduledAppointments}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Completed:</span>
                    <span className="font-medium text-green-600">
                      {analytics.completedAppointments}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Cancelled:</span>
                    <span className="font-medium text-red-600">
                      {analytics.cancelledAppointments}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold mb-4">System Health</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">Backend API</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                      ✓ Healthy
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">ML Service</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                      ✓ Healthy
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">Database</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                      ✓ Connected
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">Blockchain</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                      ✓ Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && <UserManagement />}

        {activeTab === "doctors" && <DoctorManagement />}

        {activeTab === "departments" && <DepartmentManagement />}

        {activeTab === "appointments" && <AppointmentMonitoring />}

        {activeTab === "records" && <MedicalRecordsMonitoring />}

        {activeTab === "ai" && <AIPredictionLogs />}

        {activeTab === "notifications" && <NotificationManagement />}
      </main>
    </div>
  );
}

export default AdminDashboard;
