import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TemplateEdit.css';

function TemplateEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState(null);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchTemplate();
    }
  }, [id]);

  const fetchTemplate = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('apiToken');
      const apiUrl = localStorage.getItem('apiUrl');
      
      if (!token || !apiUrl) {
        setError('API settings not found. Please configure your API URL and token first.');
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${apiUrl}/businesses/trade/template/${id}`, {
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
      setTemplate(data.data);
      
      // Get content from first section as specified
      if (data.data.sections && data.data.sections.length > 0) {
        setContent(data.data.sections[0].content || '');
      }
    } catch (error) {
      console.error('Error fetching template:', error);
      setError('Failed to fetch template. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem('apiToken');
      const apiUrl = localStorage.getItem('apiUrl');
      
      if (!token || !apiUrl) {
        alert('API settings not found. Please configure your API URL and token first.');
        return;
      }

      // Update the first section's content
      const updatedTemplate = {
        ...template,
        sections: [
          {
            ...template.sections[0],
            content: content
          }
        ]
      };

      const response = await fetch(`${apiUrl}/businesses/trade/template`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTemplate),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      alert('Template saved successfully!');
      setTemplate(updatedTemplate);
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Failed to save template. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleContentChange = (newContent) => {
    setContent(newContent);
  };

  if (isLoading) {
    return (
      <div className="template-edit-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading template...</p>
        </div>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="template-edit-page">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Error Loading Template</h2>
          <p>{error || 'Template not found'}</p>
          <button onClick={() => navigate('/templates')} className="back-btn">
            ← Back to Templates
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="template-edit-page">
      <div className="edit-header">
        <div className="header-left">
          <button onClick={() => navigate('/templates')} className="back-btn">
            ← Back to Templates
          </button>
          <div className="template-info">
            <h1>{template.name}</h1>
            <div className="template-meta">
              <span className="meta-item">Type: {template.type || 'N/A'}</span>
              <span className="meta-item">Subtype: {template.subtype || 'N/A'}</span>
            </div>
          </div>
        </div>
        <div className="header-actions">
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="save-btn"
          >
            {isSaving ? (
              <>
                <span className="spinner-small"></span>
                Saving...
              </>
            ) : (
              <>
                💾 Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      <div className="edit-container">
        <div className="editor-section">
          <div className="section-header">
            <h3>📝 HTML Editor</h3>
          </div>
          <div className="editor-wrapper">
            <textarea
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              className="html-textarea"
              placeholder="Enter your HTML content here..."
              spellCheck={false}
            />
          </div>
        </div>

        <div className="preview-section">
          <div className="section-header" style={{ marginBottom: '0px' }}>
            <h3>👁️ Preview</h3>
          </div>
          <div className="preview-wrapper" style={{ padding: '5px' }}>
            <div className="a4-preview">
              <div 
                className="preview-content"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TemplateEdit;
