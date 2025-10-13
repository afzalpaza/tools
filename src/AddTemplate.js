import React, { useState } from 'react';
import './AddTemplate.css';

function AddTemplate() {
  const [templateName, setTemplateName] = useState('');
  const [sections, setSections] = useState([
    { sectionName: '', sortOrder: 1, content: '' }
  ]);
  const [jwtToken, setJwtToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [templateType, setTemplateType] = useState('');
  const [templateSubType, setTemplateSubType] = useState('');
  const [environment, setEnvironment] = useState('test');
  const addSection = () => {
    const newSortOrder = sections.length > 0 ? Math.max(...sections.map(s => s.sortOrder)) + 1 : 1;
    setSections([...sections, { sectionName: '', sortOrder: newSortOrder, content: '' }]);
  };

  const removeSection = (index) => {
    if (sections.length > 1) {
      const newSections = sections.filter((_, i) => i !== index);
      // Re-order the sort orders to be sequential
      const reorderedSections = newSections.map((section, i) => ({
        ...section,
        sortOrder: i + 1
      }));
      setSections(reorderedSections);
    }
  };

  const updateSection = (index, field, value) => {
    const newSections = [...sections];
    if (field === 'sortOrder') {
      newSections[index][field] = parseInt(value) || 1;
    } else {
      newSections[index][field] = value;
    }
    setSections(newSections);
  };

  const moveSectionUp = (index) => {
    if (index > 0) {
      const newSections = [...sections];
      [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
      // Update sort orders
      newSections[index - 1].sortOrder = index;
      newSections[index].sortOrder = index + 1;
      setSections(newSections);
    }
  };

  const moveSectionDown = (index) => {
    if (index < sections.length - 1) {
      const newSections = [...sections];
      [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
      // Update sort orders
      newSections[index].sortOrder = index + 1;
      newSections[index + 1].sortOrder = index + 2;
      setSections(newSections);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!templateName.trim()) {
      setResponseMessage('Template name is required');
      return;
    }

    if (!jwtToken.trim()) {
      setResponseMessage('JWT token is required');
      return;
    }

    const validSections = sections.filter(section => 
      section.sectionName.trim() !== '' && section.content.trim() !== ''
    );
    
    if (validSections.length === 0) {
      setResponseMessage('At least one section with name and content is required');
      return;
    }

    setIsLoading(true);
    setResponseMessage('');

    try {
      let url = 'https://test.istakapaza.com/businesses/trade/template';
      if(environment === 'production') {
        url = 'https://istakapaza.com/businesses/trade/template';
      } else if(environment === 'local') {
        url = 'http://localhost:3002/businesses/trade/template';
      }
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': jwtToken
        },
        body: JSON.stringify({
          templateName: templateName.trim(),
          type: templateType.trim(),
          subType: templateSubType.trim() || undefined,
          sections: validSections,
          // segments: ['WSF']
        })
      });

      const data = await response.json();

      if (data.success) {
        setResponseMessage(`✅ Success: ${data.message}`);
        // Clear form on success
        setTemplateName('');
        setSections([{ sectionName: 'section1', sortOrder: 1, content: '' }]);
      } else {
        setResponseMessage(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error creating template:', error);
      setResponseMessage(`❌ Error: Failed to create template. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearForm = () => {
    setTemplateName('');
    setSections([{ sectionName: '', sortOrder: 1, content: '' }]);
    setJwtToken('');
    setResponseMessage('');
  };

  const loadSampleTemplate = () => {
    const sampleSections = [
      { sectionName: "CONTRACT NO", sortOrder: 1, content: "<p>Contract number information</p>" },
      { sectionName: "BUYER", sortOrder: 2, content: "<p>Buyer details and information</p>" },
      { sectionName: "SELLER", sortOrder: 3, content: "<p>Seller details and information</p>" },
      { sectionName: "Description of Goods", sortOrder: 4, content: "<p>Detailed description of goods</p>" },
      { sectionName: "Provisional Price", sortOrder: 5, content: "<p>Provisional pricing information</p>" },
      { sectionName: "Final Price", sortOrder: 6, content: "<p>Final pricing details</p>" },
      { sectionName: "ORIGIN", sortOrder: 7, content: "<p>Origin of goods</p>" },
      { sectionName: "SHIPMENT", sortOrder: 8, content: "<p>Shipment terms and conditions</p>" },
      { sectionName: "PAYMENT", sortOrder: 9, content: "<p>Payment terms and conditions</p>" },
      { sectionName: "BANK", sortOrder: 10, content: "<p>Banking details</p>" },
      { sectionName: "DOCUMENTS", sortOrder: 11, content: "<p>Required documentation</p>" },
      { sectionName: "INSPECTION", sortOrder: 12, content: "<p>Inspection procedures</p>" },
      { sectionName: "CLAIMS", sortOrder: 13, content: "<p>Claims and dispute procedures</p>" },
      { sectionName: "INSURANCE", sortOrder: 14, content: "<p>Insurance requirements</p>" },
      { sectionName: "TITLE AND RISKS", sortOrder: 15, content: "<p>Title and risk transfer</p>" },
      { sectionName: "TAX, DUTIES", sortOrder: 16, content: "<p>Tax and duty obligations</p>" },
      { sectionName: "VESSEL", sortOrder: 17, content: "<p>Vessel requirements</p>" },
      { sectionName: "LAYTIME AND DEMMURAGE", sortOrder: 18, content: "<p>Laytime and demurrage terms</p>" },
      { sectionName: "MARINE TERMS", sortOrder: 19, content: "<p>Marine transportation terms</p>" },
      { sectionName: "DISPUTE RESOLUTION", sortOrder: 20, content: "<p>Dispute resolution procedures</p>" },
      { sectionName: "ARBITRATION", sortOrder: 21, content: "<p>Arbitration terms</p>" },
      { sectionName: "CONFIDENTIALITY", sortOrder: 22, content: "<p>Confidentiality agreement</p>" },
      { sectionName: "ASSIGNMENT", sortOrder: 23, content: "<p>Assignment rights and restrictions</p>" },
      { sectionName: "FORCE MAJEURE", sortOrder: 24, content: "<p>Force majeure clause</p>" },
      { sectionName: "ADDITIONAL", sortOrder: 25, content: "<p>Additional terms and conditions</p>" }
    ];
    
    setTemplateName('Sample Contract Template');
    setSections(sampleSections);
  };

  return (
    <div className="add-template">
      <div className="container">
        <header className="header">
          <h1>Create Document Template</h1>
          <p>Create a new document template with custom sections including HTML content</p>
        </header>

        <div className="form-container">
          <form onSubmit={handleSubmit} className="template-form">
            <div style={{ display: 'flex', gap: '10px' }}>
              <div className="form-group">
                <label htmlFor="templateName" className="form-label">
                  Template Name *
                </label>
                <input
                  type="text"
                  id="templateName"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Enter template name..."
                  className="form-input"
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="templateType" className="form-label">
                  Template Type *
                </label>
                <input
                  type="text"
                  id="templateType"
                  value={templateType}
                  onChange={(e) => setTemplateType(e.target.value)}
                  placeholder="Enter template type..."
                  className="form-input"
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="templateSubType" className="form-label">
                  Template SubType
                </label>
                <input
                  type="text"
                  id="templateSubType"
                  value={templateSubType}
                  onChange={(e) => setTemplateSubType(e.target.value)}
                  placeholder="Enter template sub type..."
                  className="form-input"
                  disabled={isLoading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="environment" className="form-label">
                  Environment
                </label>
                <select
                  id="environment"
                  value={environment}
                  onChange={(e) => setEnvironment(e.target.value)}
                  className="form-input"
                  disabled={isLoading}
                  required
                >
                  <option value="local">Local</option>
                  <option value="test">Test</option>
                  <option value="production">Production</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                JWT Token *
              </label>
              <textarea
                value={jwtToken}
                onChange={(e) => setJwtToken(e.target.value)}
                placeholder="Paste your JWT token here..."
                className="form-textarea jwt-input"
                rows="3"
                disabled={isLoading}
                required
              />
            </div>

            <div className="form-group">
              <div className="sections-header">
                <label className="form-label">
                  Template Sections *
                </label>
                <div className="section-controls">
                  <button
                    type="button"
                    onClick={loadSampleTemplate}
                    className="sample-btn"
                    disabled={isLoading}
                  >
                    📋 Load Sample
                  </button>
                  <button
                    type="button"
                    onClick={addSection}
                    className="add-section-btn"
                    disabled={isLoading}
                  >
                    + Add Section
                  </button>
                </div>
              </div>
              
              <div className="sections-container">
                {sections.map((section, index) => (
                  <div key={index} className="section-item">
                    <div className="section-header">
                      <div className="section-order-controls">
                        <button
                          type="button"
                          onClick={() => moveSectionUp(index)}
                          className="move-btn"
                          disabled={isLoading || index === 0}
                          title="Move up"
                        >
                          ↑
                        </button>
                        <span className="sort-order">{section.sortOrder}</span>
                        <button
                          type="button"
                          onClick={() => moveSectionDown(index)}
                          className="move-btn"
                          disabled={isLoading || index === sections.length - 1}
                          title="Move down"
                        >
                          ↓
                        </button>
                      </div>
                      <input
                        type="text"
                        value={section.sectionName}
                        onChange={(e) => updateSection(index, 'sectionName', e.target.value)}
                        placeholder={`Section ${index + 1} name...`}
                        className="form-input section-name-input"
                        disabled={isLoading}
                      />
                      {sections.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSection(index)}
                          className="remove-section-btn"
                          disabled={isLoading}
                          title="Remove this section"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    <textarea
                      value={section.content}
                      onChange={(e) => updateSection(index, 'content', e.target.value)}
                      placeholder="Enter HTML content for this section..."
                      className="form-textarea section-content"
                      rows="4"
                      disabled={isLoading}
                    />
                    <div className="content-preview">
                      <small>Preview:</small>
                      <div 
                        className="html-preview-small"
                        dangerouslySetInnerHTML={{ __html: section.content }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                disabled={isLoading}
                className="submit-btn"
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Creating Template...
                  </>
                ) : (
                  <>
                    <span className="submit-icon">📄</span>
                    Create Template
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={clearForm}
                className="clear-btn"
                disabled={isLoading}
              >
                Clear Form
              </button>
            </div>

            {responseMessage && (
              <div className={`response-message ${responseMessage.includes('✅') ? 'success' : 'error'}`}>
                {responseMessage}
              </div>
            )}
          </form>

          <div className="api-info">
            <h3>API Information</h3>
            <div className="api-details">
              <p><strong>Endpoint:</strong> POST /api/createDocumentTemplate</p>
              <p><strong>Required Fields:</strong></p>
              <ul>
                <li>templateName (string): Name of the template</li>
                <li>sections (array): Array of section objects with:</li>
                <ul>
                  <li>sectionName (string): Name of the section</li>
                  <li>sortOrder (number): Order of the section</li>
                  <li>content (string): HTML content for the section</li>
                </ul>
                <li>JWT Token: Authentication token for the API</li>
              </ul>
              <p><strong>Note:</strong> You must be in business mode to create templates</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddTemplate; 