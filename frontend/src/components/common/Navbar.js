import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaCertificate, FaFileAlt, FaBook, FaUsers, FaSignOutAlt, FaSearch } from 'react-icons/fa';

const Navbar = ({ user, onLogout }) => {
  const navStyle = {
    backgroundColor: '#2c3e50',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    transition: 'background-color 0.3s'
  };

  const navLinksStyle = {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center'
  };

  return (
    <nav style={navStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <h2>Certificate Generator</h2>
        <div style={navLinksStyle}>
          <Link to="/dashboard" style={linkStyle}>
            <FaHome /> Dashboard
          </Link>
          <Link to="/certificates" style={linkStyle}>
            <FaCertificate /> Certificates
          </Link>
          {(user.role === 'CERTIFICATE_ADMIN' || user.role === 'SYSTEM_ADMIN') && (
            <Link to="/templates" style={linkStyle}>
              <FaFileAlt /> Templates
            </Link>
          )}
          <Link to="/courses" style={linkStyle}>
            <FaBook /> Courses
          </Link>
          {(user.role === 'SYSTEM_ADMIN' || user.role === 'INSTITUTION_ADMIN') && (
            <Link to="/users" style={linkStyle}>
              <FaUsers /> Users
            </Link>
          )}
          <Link to="/verify" style={linkStyle}>
            <FaSearch /> Verify
          </Link>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span>Welcome, {user.fullName} ({user.role})</span>
        <button 
          onClick={onLogout}
          style={{
            background: '#e74c3c',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;