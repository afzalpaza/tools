import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './TemplateList.css';

function TemplateList() {
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('apiToken');
      const apiUrl = localStorage.getItem('apiUrl');
      
      if (!token || !apiUrl) {
        setError('API settings not found. Please configure your API URL and token first.');
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${apiUrl}/businesses/trade/templates`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      console.error('Error fetching templates:', error);
      setError('Failed to fetch templates. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    if (!window.confirm('Are you sure you want to delete this template?')) {
      return;
    }

    try {
      const token = localStorage.getItem('apiToken');
      const apiUrl = localStorage.getItem('apiUrl');
      
      if (!token || !apiUrl) {
        alert('API settings not found. Please configure your API URL and token first.');
        return;
      }
      
      const response = await fetch(`${apiUrl}/templates/${templateId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Remove the deleted template from the list
      setTemplates(templates.filter(template => template.id !== templateId));
    } catch (error) {
      console.error('Error deleting template:', error);
      alert('Failed to delete template. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="template-list-page">
        <div className="container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading templates...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="template-list-page">
        <div className="container">
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <h2>Error Loading Templates</h2>
            <p>{error}</p>
            <button onClick={fetchTemplates} className="retry-btn">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="template-list-page">
      <div className="container">
        <header className="page-header">
          <h1>📋 Template Library</h1>
          <p>Manage your HTML templates for document generation</p>
          <Link to="/add-template" className="add-template-btn">
            ➕ Create New Template
          </Link>
        </header>

        {templates.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📄</div>
            <h2>No Templates Found</h2>
            <p>You haven't created any templates yet. Create your first template to get started.</p>
            <Link to="/add-template" className="cta-button">
              Create Your First Template
            </Link>
          </div>
        ) : (
          <div className="templates-grid">
            {templates.map((template) => (
              <div key={template.id} className="template-card">
                <div className="template-header">
                  <h3 className="template-name">{template.name}</h3>
                  <div className="template-actions">
                    <Link 
                      to={`/edit-template/${template.id}`} 
                      className="action-btn edit-btn"
                      title="Edit Template"
                    >
                      ✏️
                    </Link>
                    <button 
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="action-btn delete-btn"
                      title="Delete Template"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                
                <div className="template-info">
                  <div className="info-row">
                    <span className="info-label">Type:</span>
                    <span className="info-value">{template.type || 'N/A'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Subtype:</span>
                    <span className="info-value">{template.subtype || 'N/A'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Customers:</span>
                    <span className="info-value">
                      {template.customers && template.customers.length > 0 
                        ? `${template.customers.length} customer(s)` 
                        : 'None'}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Products:</span>
                    <span className="info-value">
                      {template.products && template.products.length > 0 
                        ? `${template.products.length} product(s)` 
                        : 'None'}
                    </span>
                  </div>
                </div>

                <div className="template-footer">
                  <Link 
                    to={`/edit-template/${template.id}`} 
                    className="edit-link"
                  >
                    Edit Template →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TemplateList;
