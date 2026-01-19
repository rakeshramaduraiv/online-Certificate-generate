import React, { useState, useEffect } from 'react';
import { FaUsers, FaEdit, FaTrash, FaUserCheck, FaUserTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { userAPI } from '../services/api';

const Users = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: '',
    isActive: true
  });

  const roles = [
    { value: 'STUDENT', label: 'Student' },
    { value: 'INSTRUCTOR', label: 'Instructor' },
    { value: 'CERTIFICATE_ADMIN', label: 'Certificate Admin' },
    { value: 'INSTITUTION_ADMIN', label: 'Institution Admin' },
    { value: 'SYSTEM_ADMIN', label: 'System Admin' },
    { value: 'VERIFIER', label: 'Verifier' }
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

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
      await userAPI.update(editingUser.id, formData);
      toast.success('User updated successfully');
      setShowModal(false);
      setEditingUser(null);
      setFormData({ fullName: '', email: '', role: '', isActive: true });
      fetchUsers();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userAPI.delete(id);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        toast.error('Failed to delete user');
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

  const getRoleColor = (role) => {
    const colors = {
      'STUDENT': '#3498db',
      'INSTRUCTOR': '#9b59b6',
      'CERTIFICATE_ADMIN': '#e67e22',
      'INSTITUTION_ADMIN': '#f39c12',
      'SYSTEM_ADMIN': '#e74c3c',
      'VERIFIER': '#27ae60'
    };
    return colors[role] || '#95a5a6';
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={{ color: '#2c3e50' }}>
          <FaUsers style={{ marginRight: '0.5rem' }} />
          Users Management
        </h1>
      </div>

      <div style={tableStyle}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#34495e', color: 'white' }}>
            <tr>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Name</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Email</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Role</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Created Date</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((userData, index) => (
              <tr key={userData.id} style={{ backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white' }}>
                <td style={{ padding: '1rem' }}>{userData.fullName}</td>
                <td style={{ padding: '1rem' }}>{userData.email}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '3px',
                    fontSize: '0.8rem',
                    backgroundColor: getRoleColor(userData.role),
                    color: 'white'
                  }}>
                    {userData.role}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    color: userData.isActive ? '#27ae60' : '#e74c3c'
                  }}>
                    {userData.isActive ? <FaUserCheck /> : <FaUserTimes />}
                    {userData.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  {new Date(userData.createdDate).toLocaleDateString()}
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => {
                        setEditingUser(userData);
                        setFormData({
                          fullName: userData.fullName,
                          email: userData.email,
                          role: userData.role,
                          isActive: userData.isActive
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
                    {user.role === 'SYSTEM_ADMIN' && userData.id !== user.id && (
                      <button
                        onClick={() => handleDelete(userData.id)}
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
            <h3>Edit User</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label>Full Name:</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                  required
                />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label>Email:</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label>Role:</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                  required
                >
                  {roles.map(role => (
                    <option key={role.value} value={role.value}>{role.label}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  />
                  Active User
                </label>
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
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingUser(null);
                    setFormData({ fullName: '', email: '', role: '', isActive: true });
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

export default Users;