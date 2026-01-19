import React, { useState } from 'react';
import { authAPI } from '../../services/api';

const ApiTest = () => {
  const [testResult, setTestResult] = useState('');

  const testConnection = async () => {
    try {
      // Test basic connection
      const response = await fetch('http://localhost:8082/');
      const text = await response.text();
      setTestResult(`Connection successful: ${text}`);
    } catch (error) {
      setTestResult(`Connection failed: ${error.message}`);
    }
  };

  const testRegistration = async () => {
    try {
      // Generate random test data to avoid hardcoded credentials
      const randomId = Math.random().toString(36).substring(7);
      const testData = {
        fullName: `Test User ${randomId}`,
        email: `test${randomId}@example.com`,
        password: `testpass${randomId}`,
        role: 'STUDENT'
      };
      
      // Test actual registration with generated data
      const response = await authAPI.register(testData);
      setTestResult(`Registration test successful: ${JSON.stringify(response.data)}`);
    } catch (error) {
      setTestResult(`Registration test failed: ${JSON.stringify(error.response?.data) || error.message}`);
    }
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: 'white', margin: '2rem', borderRadius: '10px' }}>
      <h3>API Connection Test</h3>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <button onClick={testConnection} style={{ padding: '0.5rem 1rem', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px' }}>
          Test Connection
        </button>
        <button onClick={testRegistration} style={{ padding: '0.5rem 1rem', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '5px' }}>
          Test Registration
        </button>
        <button onClick={async () => {
          try {
            const response = await fetch('http://localhost:8082/api/test/ping');
            const data = await response.json();
            setTestResult(`Ping successful: ${JSON.stringify(data)}`);
          } catch (error) {
            setTestResult(`Ping failed: ${error.message}`);
          }
        }} style={{ padding: '0.5rem 1rem', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px' }}>
          Ping Backend
        </button>
      </div>
      <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '5px', fontFamily: 'monospace', fontSize: '0.9rem' }}>
        {testResult || 'Click a button to test the API connection'}
      </div>
    </div>
  );
};

export default ApiTest;