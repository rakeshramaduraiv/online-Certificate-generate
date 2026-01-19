import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { authAPI } from '../../services/api';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const response = await authAPI.login(formData);
    
    // Store token in localStorage
    localStorage.setItem('token', response.data.token);

    // Call parent onLogin
    onLogin(response.data);

    toast.success('Login successful!');
  } catch (error) {
    toast.error(
      error.response?.data?.error || 
      'Login failed. Please check your credentials.'
    );
  }
  setLoading(false);
};


  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  };

  const formStyle = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px'
  };

  const inputGroupStyle = {
    position: 'relative',
    marginBottom: '1rem'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 0.75rem 0.75rem 2.5rem',
    border: '2px solid #e1e5e9',
    borderRadius: '5px',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.3s'
  };

  const iconStyle = {
    position: 'absolute',
    left: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#6c757d'
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#2c3e50' }}>
          <FaSignInAlt style={{ marginRight: '0.5rem' }} />
          Login
        </h2>
        
        <div style={inputGroupStyle}>
          <FaUser style={iconStyle} />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            style={inputStyle}
            required
          />
        </div>

        <div style={inputGroupStyle}>
          <FaLock style={iconStyle} />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            style={inputStyle}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '1rem',
            cursor: 'pointer',
            marginBottom: '1rem'
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p style={{ textAlign: 'center' }}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;