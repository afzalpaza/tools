import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TokenModal from '../components/TokenModal';
import './Home.css';

function Home() {
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);

  const handleTokenSetup = () => {
    setIsTokenModalOpen(true);
  };

  const handleTokenModalClose = () => {
    setIsTokenModalOpen(false);
  };

  return (
    <div className="home-page">
      <div className="home-container">
        <div className="welcome-section">
          <div className="welcome-icon">📄</div>
          <h1 className="welcome-title">Welcome to HTML to Word Tools</h1>
          <p className="welcome-subtitle">
            Your one-stop solution for converting HTML content to professional Word documents
          </p>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3>HTML Converter</h3>
              <p>Convert HTML files or content to Word documents with advanced formatting support</p>
              <Link to="/converter" className="feature-link">
                Start Converting →
              </Link>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3>Template Manager</h3>
              <p>Create and manage HTML templates for consistent document generation</p>
              <Link to="/templates" className="feature-link">
                View Templates →
              </Link>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔑</div>
              <h3>API Integration</h3>
              <p>Configure API URL and token for secure backend integrations and advanced features</p>
              <button onClick={handleTokenSetup} className="feature-link token-setup-btn">
                Setup API →
              </button>
            </div>
          </div>
          
          <div className="quick-start">
            <h2>Quick Start</h2>
            <div className="steps">
              <div className="step">
                <span className="step-number">1</span>
                <span className="step-text">Upload your HTML file or paste content</span>
              </div>
              <div className="step">
                <span className="step-number">2</span>
                <span className="step-text">Choose your conversion options</span>
              </div>
              <div className="step">
                <span className="step-number">3</span>
                <span className="step-text">Download your Word document</span>
              </div>
            </div>
            
            <Link to="/converter" className="cta-button">
              Get Started Now
            </Link>
          </div>
        </div>
      </div>
      
      <TokenModal 
        isOpen={isTokenModalOpen} 
        onClose={handleTokenModalClose}
      />
    </div>
  );
}

export default Home;
