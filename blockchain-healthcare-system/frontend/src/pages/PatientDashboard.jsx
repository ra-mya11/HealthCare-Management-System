import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import HealthScore from '../components/HealthScore';
import MedicalRecords from '../components/MedicalRecords';
import Appointments from '../components/Appointments';
import Recommendations from '../components/Recommendations';
import { removeToken } from '../utils/auth';

function PatientDashboard({ setAuth }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    removeToken();
    localStorage.removeItem('user');
    setAuth(false);
    navigate('/login');
  };

  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
    { id: 'health', label: '💚 Health Score', icon: '💚' },
    { id: 'records', label: '📋 Medical Records', icon: '📋' },
    { id: 'appointments', label: '📅 Appointments', icon: '📅' },
    { id: 'recommendations', label: '💡 Recommendations', icon: '💡' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">🏥 HealthChain</h1>
            <p className="text-sm text-gray-600">Blockchain Healthcare System</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold">{user?.name}</p>
              <p className="text-sm text-gray-600 capitalize">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-medium transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'health' && <HealthScore />}
        {activeTab === 'records' && <MedicalRecords />}
        {activeTab === 'appointments' && <Appointments />}
        {activeTab === 'recommendations' && <Recommendations />}
      </main>
    </div>
  );
}

export default PatientDashboard;
