import React from 'react';
import { Link } from 'react-router-dom';
import { FaCertificate, FaFileAlt, FaBook, FaUsers, FaSearch, FaChartBar } from 'react-icons/fa';

const Dashboard = ({ user }) => {
  const containerStyle = {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const cardStyle = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    textAlign: 'center',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'transform 0.3s, box-shadow 0.3s',
    display: 'block'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    marginTop: '2rem'
  };

  const iconStyle = {
    fontSize: '3rem',
    marginBottom: '1rem',
    color: '#3498db'
  };

  const cards = [
    {
      title: 'Certificates',
      icon: <FaCertificate style={iconStyle} />,
      link: '/certificates',
      description: 'Manage and view certificates'
    },
    {
      title: 'Courses',
      icon: <FaBook style={iconStyle} />,
      link: '/courses',
      description: 'Browse available courses'
    },
    {
      title: 'Verify Certificate',
      icon: <FaSearch style={iconStyle} />,
      link: '/verify',
      description: 'Verify certificate authenticity'
    }
  ];

  if (user.role === 'CERTIFICATE_ADMIN' || user.role === 'SYSTEM_ADMIN') {
    cards.splice(1, 0, {
      title: 'Templates',
      icon: <FaFileAlt style={iconStyle} />,
      link: '/templates',
      description: 'Manage certificate templates'
    });
  }

  if (user.role === 'SYSTEM_ADMIN' || user.role === 'INSTITUTION_ADMIN') {
    cards.push({
      title: 'Users',
      icon: <FaUsers style={iconStyle} />,
      link: '/users',
      description: 'Manage system users'
    });
  }

  return (
    <div style={containerStyle}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>
          <FaChartBar style={{ marginRight: '0.5rem' }} />
          Dashboard
        </h1>
        <p style={{ color: '#7f8c8d', fontSize: '1.1rem' }}>
          Welcome back, {user.fullName}! What would you like to do today?
        </p>
      </div>

      <div style={gridStyle}>
        {cards.map((card, index) => (
          <Link
            key={index}
            to={card.link}
            style={cardStyle}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-5px)';
              e.target.style.boxShadow = '0 8px 15px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            }}
          >
            {card.icon}
            <h3 style={{ marginBottom: '0.5rem', color: '#2c3e50' }}>{card.title}</h3>
            <p style={{ color: '#7f8c8d' }}>{card.description}</p>
          </Link>
        ))}
      </div>

      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        marginTop: '2rem'
      }}>
        <h3 style={{ color: '#2c3e50', marginBottom: '1rem' }}>Quick Stats</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#ecf0f1', borderRadius: '5px' }}>
            <h4 style={{ color: '#3498db' }}>Role</h4>
            <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{user.role}</p>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#ecf0f1', borderRadius: '5px' }}>
            <h4 style={{ color: '#27ae60' }}>Status</h4>
            <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Active</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;