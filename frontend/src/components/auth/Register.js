import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaUserPlus, FaUserTag } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { authAPI } from '../../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'STUDENT'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const roles = [
    { value: 'STUDENT', label: 'Student' },
    { value: 'INSTRUCTOR', label: 'Instructor' },
    { value: 'CERTIFICATE_ADMIN', label: 'Certificate Admin' },
    { value: 'INSTITUTION_ADMIN', label: 'Institution Admin' },
    { value: 'SYSTEM_ADMIN', label: 'System Admin' },
    { value: 'VERIFIER', label: 'Verifier' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Ensure role is properly formatted
      const registrationData = {
        ...formData,
        role: formData.role // Backend will handle string to enum conversion
      };
      console.log('Sending registration data:', registrationData);
      const response = await authAPI.register(registrationData);
      console.log('Registration response:', response);
      toast.success(response.data.message || 'Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
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
    outline: 'none'
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
          <FaUserPlus style={{ marginRight: '0.5rem' }} />
          Register
        </h2>
        
        <div style={inputGroupStyle}>
          <FaUser style={iconStyle} />
          <input
            type="text"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            style={inputStyle}
            required
          />
        </div>

        <div style={inputGroupStyle}>
          <FaEnvelope style={iconStyle} />
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

        <div style={inputGroupStyle}>
          <FaUserTag style={iconStyle} />
          <select
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value})}
            style={inputStyle}
          >
            {roles.map(role => (
              <option key={role.value} value={role.value}>{role.label}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#27ae60',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '1rem',
            cursor: 'pointer',
            marginBottom: '1rem'
          }}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>

        <p style={{ textAlign: 'center' }}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;