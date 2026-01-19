import React, { useState } from 'react';
import { FaSearch, FaCheckCircle, FaTimesCircle, FaCertificate } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { verifyAPI } from '../services/api';

const Verify = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!verificationCode.trim()) {
      toast.error('Please enter a verification code');
      return;
    }

    setLoading(true);
    try {
      const response = await verifyAPI.verify(verificationCode);
      setResult({
        valid: true,
        certificate: response.data
      });
    } catch (error) {
      setResult({
        valid: false,
        message: 'Certificate not found or invalid verification code'
      });
    }
    setLoading(false);
  };

  const containerStyle = {
    padding: '2rem',
    maxWidth: '800px',
    margin: '0 auto',
    minHeight: '80vh'
  };

  const cardStyle = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    marginBottom: '2rem'
  };

  const inputGroupStyle = {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem'
  };

  const inputStyle = {
    flex: 1,
    padding: '0.75rem',
    border: '2px solid #e1e5e9',
    borderRadius: '5px',
    fontSize: '1rem',
    outline: 'none'
  };

  const buttonStyle = {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '0.75rem 2rem',
    borderRadius: '5px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1rem'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={{ color: '#2c3e50', textAlign: 'center', marginBottom: '2rem' }}>
          <FaSearch style={{ marginRight: '0.5rem' }} />
          Certificate Verification
        </h1>
        
        <p style={{ textAlign: 'center', color: '#7f8c8d', marginBottom: '2rem' }}>
          Enter the verification code to check if a certificate is authentic and valid.
        </p>

        <form onSubmit={handleVerify}>
          <div style={inputGroupStyle}>
            <input
              type="text"
              placeholder="Enter verification code (e.g., ABC123XYZ456)"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
              style={inputStyle}
              maxLength={50}
            />
            <button
              type="submit"
              disabled={loading}
              style={buttonStyle}
            >
              <FaSearch />
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </div>
        </form>

        {result && (
          <div style={{
            padding: '2rem',
            borderRadius: '10px',
            backgroundColor: result.valid ? '#d5f4e6' : '#ffeaa7',
            border: `2px solid ${result.valid ? '#27ae60' : '#e17055'}`,
            marginTop: '2rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              {result.valid ? (
                <FaCheckCircle style={{ color: '#27ae60', fontSize: '2rem' }} />
              ) : (
                <FaTimesCircle style={{ color: '#e17055', fontSize: '2rem' }} />
              )}
              <h3 style={{ color: result.valid ? '#27ae60' : '#e17055' }}>
                {result.valid ? 'Certificate Valid' : 'Certificate Invalid'}
              </h3>
            </div>

            {result.valid && result.certificate ? (
              <div style={{ color: '#2c3e50' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                  <div>
                    <strong>Certificate Number:</strong>
                    <p style={{ margin: '0.25rem 0', color: '#7f8c8d' }}>
                      {result.certificate.certificateNumber}
                    </p>
                  </div>
                  <div>
                    <strong>Recipient:</strong>
                    <p style={{ margin: '0.25rem 0', color: '#7f8c8d' }}>
                      {result.certificate.recipient?.fullName || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <strong>Course:</strong>
                    <p style={{ margin: '0.25rem 0', color: '#7f8c8d' }}>
                      {result.certificate.course?.courseName || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <strong>Issue Date:</strong>
                    <p style={{ margin: '0.25rem 0', color: '#7f8c8d' }}>
                      {new Date(result.certificate.issueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <strong>Status:</strong>
                    <p style={{ margin: '0.25rem 0' }}>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '3px',
                        fontSize: '0.8rem',
                        backgroundColor: result.certificate.status === 'ACTIVE' ? '#27ae60' : '#e74c3c',
                        color: 'white'
                      }}>
                        {result.certificate.status}
                      </span>
                    </p>
                  </div>
                  <div>
                    <strong>Verification Code:</strong>
                    <p style={{ margin: '0.25rem 0', color: '#7f8c8d', fontFamily: 'monospace' }}>
                      {result.certificate.verificationCode}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p style={{ color: '#e17055', margin: 0 }}>
                {result.message}
              </p>
            )}
          </div>
        )}
      </div>

      <div style={cardStyle}>
        <h3 style={{ color: '#2c3e50', marginBottom: '1rem' }}>
          <FaCertificate style={{ marginRight: '0.5rem' }} />
          How to Verify
        </h3>
        <div style={{ color: '#7f8c8d', lineHeight: '1.6' }}>
          <p><strong>1.</strong> Locate the verification code on your certificate</p>
          <p><strong>2.</strong> Enter the code in the field above</p>
          <p><strong>3.</strong> Click "Verify" to check authenticity</p>
          <p><strong>4.</strong> View the certificate details if valid</p>
        </div>
        
        <div style={{
          backgroundColor: '#ecf0f1',
          padding: '1rem',
          borderRadius: '5px',
          marginTop: '1rem'
        }}>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#7f8c8d' }}>
            <strong>Note:</strong> This verification system checks certificates issued through our platform. 
            If you're having trouble verifying a certificate, please contact the issuing institution.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Verify;