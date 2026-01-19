import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/common/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ApiTest from './components/common/ApiTest';
import Dashboard from './pages/Dashboard';
import Certificates from './pages/Certificates';
import Templates from './pages/Templates';
import Courses from './pages/Courses';
import Users from './pages/Users';
import Verify from './pages/Verify';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleLogin = (jwtResponse) => {
    localStorage.setItem('token', jwtResponse.token);
    const userData = {
      id: jwtResponse.id,
      fullName: jwtResponse.fullName,
      email: jwtResponse.email,
      role: jwtResponse.role
    };
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        {user && <Navbar user={user} onLogout={handleLogout} />}
        <Routes>
          <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
          <Route path="/test" element={<ApiTest />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
          <Route path="/certificates" element={user ? <Certificates user={user} /> : <Navigate to="/login" />} />
          <Route path="/templates" element={user ? <Templates user={user} /> : <Navigate to="/login" />} />
          <Route path="/courses" element={user ? <Courses user={user} /> : <Navigate to="/login" />} />
          <Route path="/users" element={user ? <Users user={user} /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Router>
  );
};

export default App;