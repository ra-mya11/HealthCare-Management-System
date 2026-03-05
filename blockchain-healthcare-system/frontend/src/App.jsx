import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { getToken } from './utils/auth';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = getToken();
    const user = localStorage.getItem('user');
    if (token && user) {
      setIsAuthenticated(true);
      setUserRole(JSON.parse(user).role);
    }
  }, []);

  const getDashboard = () => {
    switch(userRole) {
      case 'patient':
        return <PatientDashboard setAuth={setIsAuthenticated} />;
      case 'doctor':
        return <DoctorDashboard setAuth={setIsAuthenticated} />;
      case 'admin':
        return <AdminDashboard setAuth={setIsAuthenticated} />;
      default:
        return <Navigate to="/login" />;
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route 
            path="/login" 
            element={!isAuthenticated ? <Login setAuth={setIsAuthenticated} setRole={setUserRole} /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? getDashboard() : <Navigate to="/login" />} 
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
