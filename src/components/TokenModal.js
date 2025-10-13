import React, { useState, useEffect } from 'react';
import './TokenModal.css';

const TokenModal = ({ isOpen, onClose }) => {
  const [token, setToken] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const savedToken = localStorage.getItem('apiToken');
      const savedApiUrl = localStorage.getItem('apiUrl');
      if (savedToken || savedApiUrl) {
        setToken(savedToken || '');
        setApiUrl(savedApiUrl || '');
        setIsEditing(true);
      } else {
        setToken('');
        setApiUrl('');
        setIsEditing(false);
      }
    }
  }, [isOpen]);

  const handleSave = () => {
    if (token.trim() && apiUrl.trim()) {
      localStorage.setItem('apiToken', token.trim());
      localStorage.setItem('apiUrl', apiUrl.trim());
      onClose();
    } else {
      alert('Please enter both API token and API URL');
    }
  };

  const handleClear = () => {
    localStorage.removeItem('apiToken');
    localStorage.removeItem('apiUrl');
    setToken('');
    setApiUrl('');
    setIsEditing(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? '🔑 Update API Settings' : '🔑 Add API Settings'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="api-url-input">API URL:</label>
            <input
              id="api-url-input"
              type="url"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="https://your-api-domain.com"
              className="api-input"
              autoFocus
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="token-input">API Token:</label>
            <input
              id="token-input"
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter your API token..."
              className="api-input"
            />
          </div>
          
          {isEditing && (
            <div className="api-status">
              <span className="api-exists">✅ API settings already saved</span>
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <button onClick={handleSave} className="btn-save">
            💾 Save Settings
          </button>
          {isEditing && (
            <button onClick={handleClear} className="btn-clear">
              🗑️ Clear Settings
            </button>
          )}
          <button onClick={onClose} className="btn-cancel">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenModal;
