import React, { useState, useEffect } from 'react';
import { FaBook, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { courseAPI, templateAPI } from '../services/api';

const Courses = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    courseName: '',
    description: '',
    completionCriteria: '',
    certificateTemplateId: ''
  });

  useEffect(() => {
    fetchCourses();
    fetchTemplates();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await courseAPI.getAll();
      setCourses(response.data);
    } catch (error) {
      toast.error('Failed to fetch courses');
    }
  };

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
      const courseData = {
        courseName: formData.courseName,
        description: formData.description,
        completionCriteria: formData.completionCriteria,
        certificateTemplate: formData.certificateTemplateId ? { id: formData.certificateTemplateId } : null
      };

      if (editingCourse) {
        await courseAPI.update(editingCourse.id, courseData);
        toast.success('Course updated successfully');
      } else {
        await courseAPI.create(courseData);
        toast.success('Course created successfully');
      }
      setShowModal(false);
      setEditingCourse(null);
      setFormData({ courseName: '', description: '', completionCriteria: '', certificateTemplateId: '' });
      fetchCourses();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await courseAPI.delete(id);
        toast.success('Course deleted successfully');
        fetchCourses();
      } catch (error) {
        toast.error('Failed to delete course');
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
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
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
    maxWidth: '600px'
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={{ color: '#2c3e50' }}>
          <FaBook style={{ marginRight: '0.5rem' }} />
          Courses
        </h1>
        {(user.role === 'INSTRUCTOR' || user.role === 'CERTIFICATE_ADMIN' || user.role === 'SYSTEM_ADMIN') && (
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
            <FaPlus /> Add Course
          </button>
        )}
      </div>

      <div style={gridStyle}>
        {courses.map((course) => (
          <div key={course.id} style={cardStyle}>
            <h3 style={{ color: '#2c3e50', marginBottom: '1rem' }}>{course.courseName}</h3>
            <p style={{ color: '#7f8c8d', marginBottom: '1rem', minHeight: '60px' }}>
              {course.description || 'No description available'}
            </p>
            
            {course.completionCriteria && (
              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ color: '#34495e' }}>Completion Criteria:</strong>
                <p style={{ color: '#7f8c8d', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                  {course.completionCriteria}
                </p>
              </div>
            )}

            {course.certificateTemplate && (
              <div style={{ marginBottom: '1rem' }}>
                <span style={{
                  padding: '0.25rem 0.5rem',
                  borderRadius: '3px',
                  fontSize: '0.8rem',
                  backgroundColor: '#3498db',
                  color: 'white'
                }}>
                  Template: {course.certificateTemplate.name}
                </span>
              </div>
            )}

            {(user.role === 'INSTRUCTOR' || user.role === 'CERTIFICATE_ADMIN' || user.role === 'SYSTEM_ADMIN') && (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button
                  onClick={() => {
                    setEditingCourse(course);
                    setFormData({
                      courseName: course.courseName,
                      description: course.description || '',
                      completionCriteria: course.completionCriteria || '',
                      certificateTemplateId: course.certificateTemplate?.id || ''
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
                  onClick={() => handleDelete(course.id)}
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
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <h3>{editingCourse ? 'Edit Course' : 'Add Course'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label>Course Name:</label>
                <input
                  type="text"
                  value={formData.courseName}
                  onChange={(e) => setFormData({...formData, courseName: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                  required
                />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label>Description:</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem', minHeight: '80px' }}
                  placeholder="Enter course description..."
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label>Completion Criteria:</label>
                <textarea
                  value={formData.completionCriteria}
                  onChange={(e) => setFormData({...formData, completionCriteria: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem', minHeight: '60px' }}
                  placeholder="Enter completion criteria..."
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label>Certificate Template (Optional):</label>
                <select
                  value={formData.certificateTemplateId}
                  onChange={(e) => setFormData({...formData, certificateTemplateId: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                >
                  <option value="">Select Template</option>
                  {templates.filter(t => t.approvalStatus === 'APPROVED').map(template => (
                    <option key={template.id} value={template.id}>{template.name}</option>
                  ))}
                </select>
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
                  {editingCourse ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingCourse(null);
                    setFormData({ courseName: '', description: '', completionCriteria: '', certificateTemplateId: '' });
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

export default Courses;