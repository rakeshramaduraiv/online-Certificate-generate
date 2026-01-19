import React, { useState, useEffect } from 'react';
import { FaFileAlt, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { templateAPI } from '../services/api';

const Templates = ({ user }) => {
  const [templates, setTemplates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    designData: ''
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await templateAPI.getAll();
      setTemplates(response.data);
    } catch (error) {
      toast.error('Failed to fetch templates');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTemplate) {
        await templateAPI.update(editingTemplate.id, formData);
        toast.success('Template updated successfully');
      } else {
        await templateAPI.create(formData);
        toast.success('Template created successfully');
      }
      setShowModal(false);
      setEditingTemplate(null);
      setFormData({ name: '', designData: '' });
      fetchTemplates();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        await templateAPI.delete(id);
        toast.success('Template deleted successfully');
        fetchTemplates();
      } catch (error) {
        toast.error('Failed to delete template');
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

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '2rem'
  };

  const cardStyle = {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s'
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
          <FaFileAlt style={{ marginRight: '0.5rem' }} />
          Certificate Templates
        </h1>
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
          <FaPlus /> Add Template
        </button>
      </div>

      <div style={gridStyle}>
        {templates.map((template) => (
          <div key={template.id} style={cardStyle}>
            <h3 style={{ color: '#2c3e50', marginBottom: '1rem' }}>{template.name}</h3>
            <p style={{ color: '#7f8c8d', marginBottom: '1rem', minHeight: '60px' }}>
              {template.designData ? template.designData.substring(0, 100) + '...' : 'No design data'}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{
                  padding: '0.25rem 0.5rem',
                  borderRadius: '3px',
                  fontSize: '0.8rem',
                  backgroundColor: template.approvalStatus === 'APPROVED' ? '#27ae60' : 
                                 template.approvalStatus === 'REJECTED' ? '#e74c3c' : '#f39c12',
                  color: 'white'
                }}>
                  {template.approvalStatus}
                </span>
                <div style={{ fontSize: '0.8rem', color: '#95a5a6', marginTop: '0.5rem' }}>
                  Version: {template.version}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => {
                    setEditingTemplate(template);
                    setFormData({
                      name: template.name,
                      designData: template.designData || ''
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
                <button
                  onClick={() => handleDelete(template.id)}
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
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <h3>{editingTemplate ? 'Edit Template' : 'Add Template'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label>Template Name:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                  required
                />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label>Design Data:</label>
                <textarea
                  value={formData.designData}
                  onChange={(e) => setFormData({...formData, designData: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem', minHeight: '100px' }}
                  placeholder="Enter template design data or HTML content..."
                />
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
                  {editingTemplate ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingTemplate(null);
                    setFormData({ name: '', designData: '' });
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

export default Templates;