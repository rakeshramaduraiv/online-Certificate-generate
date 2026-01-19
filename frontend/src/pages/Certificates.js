import React, { useState, useEffect } from 'react';
import { FaCertificate, FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { certificateAPI, courseAPI, userAPI } from '../services/api';

const Certificates = ({ user }) => {
  const [certificates, setCertificates] = useState([]);
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCert, setEditingCert] = useState(null);
  const [formData, setFormData] = useState({
    recipientId: '',
    recipientEmail: '',
    courseId: '',
    certificateNumber: '',
    verificationCode: ''
  });

  useEffect(() => {
    fetchCertificates();
    fetchCourses();
    if (user.role === 'CERTIFICATE_ADMIN' || user.role === 'SYSTEM_ADMIN') {
      fetchUsers();
    }
  }, [user.role]);

  const fetchCertificates = async () => {
    try {
      const response = user.role === 'STUDENT' 
        ? await certificateAPI.getMy()
        : await certificateAPI.getAll();
      setCertificates(response.data);
    } catch (error) {
      toast.error('Failed to fetch certificates');
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await courseAPI.getAll();
      setCourses(response.data);
    } catch (error) {
      toast.error('Failed to fetch courses');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getAll();
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to fetch users');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = { ...formData };
      
      // For instructors, use email to find recipient
      if (user.role === 'INSTRUCTOR' && formData.recipientEmail) {
        delete submitData.recipientId;
        submitData.recipientEmail = formData.recipientEmail;
      }
      
      if (editingCert) {
        await certificateAPI.update(editingCert.id, submitData);
        toast.success('Certificate updated successfully');
      } else {
        await certificateAPI.create(submitData);
        toast.success('Certificate created successfully');
      }
      setShowModal(false);
      setEditingCert(null);
      setFormData({ recipientId: '', recipientEmail: '', courseId: '', certificateNumber: '', verificationCode: '' });
      fetchCertificates();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this certificate?')) {
      try {
        await certificateAPI.delete(id);
        toast.success('Certificate deleted successfully');
        fetchCertificates();
      } catch (error) {
        toast.error('Failed to delete certificate');
      }
    }
  };

  const containerStyle = {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem'
  };

  const tableStyle = {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  };

  const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  };

  const modalContentStyle = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '10px',
    width: '90%',
    maxWidth: '500px'
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={{ color: '#2c3e50' }}>
          <FaCertificate style={{ marginRight: '0.5rem' }} />
          Certificates
        </h1>
        {(user.role === 'CERTIFICATE_ADMIN' || user.role === 'INSTRUCTOR' || user.role === 'SYSTEM_ADMIN') && (
          <button
            onClick={() => setShowModal(true)}
            style={{
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <FaPlus /> Add Certificate
          </button>
        )}
      </div>

      <div style={tableStyle}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#34495e', color: 'white' }}>
            <tr>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Certificate Number</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Course</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Recipient</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Issue Date</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {certificates.map((cert, index) => (
              <tr key={cert.id} style={{ backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white' }}>
                <td style={{ padding: '1rem' }}>{cert.certificateNumber}</td>
                <td style={{ padding: '1rem' }}>{cert.course?.courseName || 'N/A'}</td>
                <td style={{ padding: '1rem' }}>{cert.recipient?.fullName || 'N/A'}</td>
                <td style={{ padding: '1rem' }}>{new Date(cert.issueDate).toLocaleDateString()}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '3px',
                    fontSize: '0.8rem',
                    backgroundColor: cert.status === 'ACTIVE' ? '#27ae60' : '#e74c3c',
                    color: 'white'
                  }}>
                    {cert.status}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => {
                        setEditingCert(cert);
                        setFormData({
                          recipientId: cert.recipient?.id || '',
                          courseId: cert.course?.id || '',
                          certificateNumber: cert.certificateNumber,
                          verificationCode: ''
                        });
                        setShowModal(true);
                      }}
                      style={{
                        backgroundColor: '#f39c12',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem',
                        borderRadius: '3px',
                        cursor: 'pointer'
                      }}
                    >
                      <FaEdit />
                    </button>
                    {(user.role === 'CERTIFICATE_ADMIN' || user.role === 'SYSTEM_ADMIN') && (
                      <button
                        onClick={() => handleDelete(cert.id)}
                        style={{
                          backgroundColor: '#e74c3c',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem',
                          borderRadius: '3px',
                          cursor: 'pointer'
                        }}
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <h3>{editingCert ? 'Edit Certificate' : 'Add Certificate'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label>Course:</label>
                <select
                  value={formData.courseId}
                  onChange={(e) => setFormData({...formData, courseId: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                  required
                >
                  <option value="">Select Course</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.courseName}</option>
                  ))}
                </select>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label>Recipient:</label>
                {(user.role === 'CERTIFICATE_ADMIN' || user.role === 'SYSTEM_ADMIN') ? (
                  <select
                    value={formData.recipientId}
                    onChange={(e) => setFormData({...formData, recipientId: e.target.value})}
                    style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                    required
                  >
                    <option value="">Select Recipient</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>{user.fullName} ({user.email})</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="email"
                    placeholder="Enter recipient email"
                    value={formData.recipientEmail || ''}
                    onChange={(e) => setFormData({...formData, recipientEmail: e.target.value})}
                    style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                    required
                  />
                )}
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#27ae60',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  {editingCert ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingCert(null);
                    setFormData({ recipientId: '', courseId: '', certificateNumber: '', verificationCode: '' });
                  }}
                  style={{
                    backgroundColor: '#95a5a6',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Certificates;