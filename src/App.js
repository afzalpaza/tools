import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Converter from './pages/Converter';
import AddTemplate from './pages/AddTemplate';
import TemplateList from './pages/TemplateList';
import TemplateEdit from './pages/TemplateEdit';
import TokenModal from './components/TokenModal';
import './App.css';

function Navigation() {
  const location = useLocation();
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  // Check if token and API URL exist on component mount
  React.useEffect(() => {
    const token = localStorage.getItem('apiToken');
    const apiUrl = localStorage.getItem('apiUrl');
    setHasToken(!!(token && apiUrl));
  }, []);

  const handleTokenModalClose = () => {
    setIsTokenModalOpen(false);
    // Recheck token and API URL status after modal closes
    const token = localStorage.getItem('apiToken');
    const apiUrl = localStorage.getItem('apiUrl');
    setHasToken(!!(token && apiUrl));
  };
  
  return (
    <>
      <nav className="navigation">
        <div className="nav-container">
          <div className="nav-brand">
            <span className="nav-logo">📄</span>
            HTML to Word Tools
          </div>
          <div className="nav-links">
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              🏠 Home
            </Link>
            <Link 
              to="/converter" 
              className={`nav-link ${location.pathname === '/converter' ? 'active' : ''}`}
            >
              🔄 Converter
            </Link>
            <Link 
              to="/templates" 
              className={`nav-link ${location.pathname === '/templates' ? 'active' : ''}`}
            >
              📋 Templates
            </Link>
            <Link 
              to="/add-template" 
              className={`nav-link ${location.pathname === '/add-template' ? 'active' : ''}`}
            >
              📝 Add Template
            </Link>
            <button 
              onClick={() => setIsTokenModalOpen(true)}
              className="nav-link token-btn"
            >
              🔑 {hasToken ? 'Update API' : 'Setup API'}
            </button>
          </div>
        </div>
      </nav>
      <TokenModal 
        isOpen={isTokenModalOpen} 
        onClose={handleTokenModalClose}
      />
    </>
  );
}


function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/converter" element={<Converter />} />
          <Route path="/templates" element={<TemplateList />} />
          <Route path="/add-template" element={<AddTemplate />} />
          <Route path="/edit-template/:id" element={<TemplateEdit />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 