import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import htmlDocx from 'html-docx-js/dist/html-docx';
import TipTapEditor from './TipTapEditor';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [htmlContent, setHtmlContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [useCompatibleMode, setUseCompatibleMode] = useState(true);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/html') {
      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        setHtmlContent(content);
        setPreviewContent(content);
        setEditMode(true); // Switch to edit mode when file is loaded
      };
      reader.readAsText(file);
    } else {
      alert('Please select a valid HTML file');
    }
  };

  const handleHtmlContentChange = (event) => {
    const content = event.target.value;
    setHtmlContent(content);
    setPreviewContent(content);
  };

  const handleEditorChange = (content) => {
    setHtmlContent(content);
    setPreviewContent(content);
  };

  const convertToWord = async () => {
    if (!htmlContent.trim()) {
      alert('Please provide HTML content to convert');
      return;
    }

    setIsLoading(true);

    try {
      // Generate filename
      const filename = selectedFile 
        ? selectedFile.name.replace('.html', '.docx')
        : 'converted-document.docx';

              if (useCompatibleMode) {
          // Use enhanced SharePoint-compatible processing
          const processedHtml = processHtmlForSharePointCompatibility(htmlContent);
          const converted = htmlDocx.asBlob(processedHtml);
          saveAs(converted, filename);
        } else {
          // Use standard processing (original method)
          const processedHtml = processHtmlForWord(htmlContent);
          const converted = htmlDocx.asBlob(processedHtml);
          saveAs(converted, filename);
        }
    } catch (error) {
      console.error('Conversion error:', error);
      alert('Error converting HTML to Word. Please check your HTML content.');
    } finally {
      setIsLoading(false);
    }
  };

  const processHtmlForWord = (html) => {
    // Clean up and process HTML for better Word conversion and SharePoint compatibility
    let processedHtml = html;

    // Remove or replace problematic CSS properties that cause SharePoint issues
    processedHtml = processedHtml.replace(/page-break-before\s*:\s*always\s*;?/gi, 'margin-top: 40px;');
    processedHtml = processedHtml.replace(/page-break-after\s*:\s*always\s*;?/gi, 'margin-bottom: 40px;');
    processedHtml = processedHtml.replace(/page-break-inside\s*:\s*avoid\s*;?/gi, '');
    
    // Remove problematic CSS properties that SharePoint doesn't handle well
    processedHtml = processedHtml.replace(/position\s*:\s*(absolute|fixed|sticky)\s*;?/gi, '');
    processedHtml = processedHtml.replace(/transform\s*:[^;]+;?/gi, '');
    processedHtml = processedHtml.replace(/z-index\s*:[^;]+;?/gi, '');
    processedHtml = processedHtml.replace(/box-shadow\s*:[^;]+;?/gi, '');
    processedHtml = processedHtml.replace(/filter\s*:[^;]+;?/gi, '');
    processedHtml = processedHtml.replace(/opacity\s*:\s*0\s*;?/gi, '');
    
    // Remove problematic HTML attributes
    processedHtml = processedHtml.replace(/\s+contenteditable\s*=\s*["'][^"']*["']/gi, '');
    processedHtml = processedHtml.replace(/\s+draggable\s*=\s*["'][^"']*["']/gi, '');
    processedHtml = processedHtml.replace(/\s+spellcheck\s*=\s*["'][^"']*["']/gi, '');

    // Create a temporary div to manipulate the DOM
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = processedHtml;

    // Remove problematic elements that SharePoint doesn't support
    const problematicSelectors = [
      'script', 'iframe', 'embed', 'object', 'applet', 'canvas', 'audio', 'video',
      'svg', 'math', 'input', 'button', 'select', 'textarea', 'form'
    ];
    
    problematicSelectors.forEach(selector => {
      const elements = tempDiv.querySelectorAll(selector);
      elements.forEach(el => el.remove());
    });

    // Clean up data attributes that might cause issues
    const allElements = tempDiv.querySelectorAll('*');
    allElements.forEach(el => {
      // Remove data attributes except essential ones
      Array.from(el.attributes).forEach(attr => {
        if (attr.name.startsWith('data-') && !['data-start'].includes(attr.name)) {
          el.removeAttribute(attr.name);
        }
      });
      
      // Remove event handlers
      Array.from(el.attributes).forEach(attr => {
        if (attr.name.startsWith('on')) {
          el.removeAttribute(attr.name);
        }
      });
    });

    // Ensure proper structure for better Word/SharePoint compatibility
    const addSpacing = (element) => {
      const blockElements = ['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'blockquote'];
      
      if (blockElements.includes(element.tagName?.toLowerCase())) {
        // Add a line break after block elements if not already present
        if (element.nextSibling && element.nextSibling.nodeType === Node.TEXT_NODE) {
          element.nextSibling.textContent = '\n' + element.nextSibling.textContent;
        } else if (element.nextSibling) {
          element.parentNode.insertBefore(document.createTextNode('\n'), element.nextSibling);
        }
      }

      // Recursively process children
      Array.from(element.children).forEach(addSpacing);
    };

    // Process all elements to add proper spacing
    Array.from(tempDiv.children).forEach(addSpacing);

    // Create the final HTML with SharePoint-compatible structure and styling
    const finalHtml = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
    <meta charset="UTF-8">
    <meta name="ProgId" content="Word.Document">
    <meta name="Generator" content="Microsoft Word 15">
    <meta name="Originator" content="Microsoft Word 15">
    <!--[if !mso]>
    <style>
        v\\:* {behavior:url(#default#VML);}
        o\\:* {behavior:url(#default#VML);}
        w\\:* {behavior:url(#default#VML);}
        .shape {behavior:url(#default#VML);}
    </style>
    <![endif]-->
    <style>
        body {
            font-family: "Calibri", "Times New Roman", serif;
            font-size: 11pt;
            line-height: 1.15;
            color: #000000;
            background-color: #ffffff;
            margin: 0;
            padding: 0;
        }
        h1 {
            font-size: 18pt;
            font-weight: bold;
            margin: 12pt 0 6pt 0;
            color: #000000;
            font-family: "Calibri", serif;
        }
        h2 {
            font-size: 16pt;
            font-weight: bold;
            margin: 10pt 0 5pt 0;
            color: #000000;
            font-family: "Calibri", serif;
        }
        h3 {
            font-size: 14pt;
            font-weight: bold;
            margin: 8pt 0 4pt 0;
            color: #000000;
            font-family: "Calibri", serif;
        }
        h4, h5, h6 {
            font-size: 12pt;
            font-weight: bold;
            margin: 6pt 0 3pt 0;
            color: #000000;
            font-family: "Calibri", serif;
        }
        p {
            margin: 0 0 8pt 0;
            text-align: left;
            font-family: "Calibri", serif;
        }
        ul, ol {
            margin: 8pt 0;
            padding-left: 18pt;
        }
        li {
            margin: 2pt 0;
            font-family: "Calibri", serif;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 8pt 0;
            font-family: "Calibri", serif;
        }
        th, td {
            border: 0.75pt solid #000000;
            padding: 4pt;
            text-align: left;
            vertical-align: top;
            font-family: "Calibri", serif;
        }
        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        blockquote {
            margin: 8pt 0 8pt 18pt;
            padding-left: 8pt;
            border-left: 2pt solid #cccccc;
            font-style: italic;
            font-family: "Calibri", serif;
        }
        strong, b {
            font-weight: bold;
        }
        em, i {
            font-style: italic;
        }
        u {
            text-decoration: underline;
        }
        a {
            color: #0563c1;
            text-decoration: underline;
        }
        a:visited {
            color: #954f72;
        }
        .highlight {
            background-color: #ffff00;
        }
        .important {
            color: #c5504b;
            font-weight: bold;
        }
        /* Remove any remaining problematic styles */
        * {
            max-width: none !important;
            position: static !important;
            transform: none !important;
            transition: none !important;
            animation: none !important;
        }
    </style>
</head>
<body>
${tempDiv.innerHTML}
</body>
</html>`;

    return finalHtml;
  };

  const processHtmlForSharePointCompatibility = (html) => {
    // Enhanced SharePoint-compatible processing using html-docx-js
    let processedHtml = html;

    // Remove or replace problematic CSS properties that cause SharePoint issues
    processedHtml = processedHtml.replace(/page-break-before\s*:\s*always\s*;?/gi, 'margin-top: 20px;');
    processedHtml = processedHtml.replace(/page-break-after\s*:\s*always\s*;?/gi, 'margin-bottom: 20px;');
    processedHtml = processedHtml.replace(/page-break-inside\s*:\s*avoid\s*;?/gi, '');
    
    // Remove advanced CSS that SharePoint Online doesn't handle well
    processedHtml = processedHtml.replace(/position\s*:\s*(absolute|fixed|sticky)\s*;?/gi, '');
    processedHtml = processedHtml.replace(/transform\s*:[^;]+;?/gi, '');
    processedHtml = processedHtml.replace(/z-index\s*:[^;]+;?/gi, '');
    processedHtml = processedHtml.replace(/box-shadow\s*:[^;]+;?/gi, '');
    processedHtml = processedHtml.replace(/filter\s*:[^;]+;?/gi, '');
    processedHtml = processedHtml.replace(/transition\s*:[^;]+;?/gi, '');
    processedHtml = processedHtml.replace(/animation\s*:[^;]+;?/gi, '');
    processedHtml = processedHtml.replace(/opacity\s*:\s*0\s*;?/gi, '');
    processedHtml = processedHtml.replace(/visibility\s*:\s*hidden\s*;?/gi, '');
    
    // Create a temporary div to clean up the DOM
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = processedHtml;

    // Remove problematic elements that SharePoint doesn't support
    const problematicSelectors = [
      'script', 'iframe', 'embed', 'object', 'applet', 'canvas', 'audio', 'video',
      'svg', 'math', 'input', 'button', 'select', 'textarea', 'form', 'style'
    ];
    
    problematicSelectors.forEach(selector => {
      const elements = tempDiv.querySelectorAll(selector);
      elements.forEach(el => el.remove());
    });

    // Clean up attributes that cause SharePoint issues
    const allElements = tempDiv.querySelectorAll('*');
    allElements.forEach(el => {
      // Remove problematic attributes
      Array.from(el.attributes).forEach(attr => {
        if (attr.name.startsWith('data-') && !['data-start'].includes(attr.name)) {
          el.removeAttribute(attr.name);
        }
        if (attr.name.startsWith('on')) {
          el.removeAttribute(attr.name);
        }
        if (['contenteditable', 'draggable', 'spellcheck', 'tabindex'].includes(attr.name)) {
          el.removeAttribute(attr.name);
        }
      });
      
      // Convert CSS classes that might cause issues
      if (el.className) {
        el.className = el.className.replace(/[^a-zA-Z0-9\s\-_]/g, '');
      }
    });

    // Ensure proper spacing for better Word/SharePoint compatibility
    const addSpacing = (element) => {
      const blockElements = ['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'blockquote'];
      
      if (blockElements.includes(element.tagName?.toLowerCase())) {
        if (element.nextSibling && element.nextSibling.nodeType === Node.TEXT_NODE) {
          element.nextSibling.textContent = '\n' + element.nextSibling.textContent;
        } else if (element.nextSibling) {
          element.parentNode.insertBefore(document.createTextNode('\n'), element.nextSibling);
        }
      }

      Array.from(element.children).forEach(addSpacing);
    };

    Array.from(tempDiv.children).forEach(addSpacing);

    // Create SharePoint-optimized HTML structure
    const sharePointOptimizedHtml = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
    <meta charset="UTF-8">
    <meta name="ProgId" content="Word.Document">
    <meta name="Generator" content="Microsoft Word 15">
    <meta name="Originator" content="Microsoft Word 15">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <style>
        /* SharePoint-optimized styles */
        body {
            font-family: Calibri, Arial, sans-serif;
            font-size: 11pt;
            line-height: 1.15;
            color: #000000;
            background: white;
            margin: 1in;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        h1 { font-size: 18pt; font-weight: bold; margin: 12pt 0 6pt 0; color: #000000; }
        h2 { font-size: 16pt; font-weight: bold; margin: 10pt 0 5pt 0; color: #000000; }
        h3 { font-size: 14pt; font-weight: bold; margin: 8pt 0 4pt 0; color: #000000; }
        h4, h5, h6 { font-size: 12pt; font-weight: bold; margin: 6pt 0 3pt 0; color: #000000; }
        p { margin: 0 0 6pt 0; text-align: left; }
        ul, ol { margin: 6pt 0; padding-left: 18pt; }
        li { margin: 2pt 0; }
        table { border-collapse: collapse; width: 100%; margin: 6pt 0; }
        th, td { border: 0.5pt solid #000000; padding: 3pt; text-align: left; vertical-align: top; }
        th { background-color: #f2f2f2; font-weight: bold; }
        blockquote { margin: 6pt 0 6pt 18pt; padding-left: 6pt; border-left: 2pt solid #cccccc; font-style: italic; }
        strong, b { font-weight: bold; }
        em, i { font-style: italic; }
        u { text-decoration: underline; }
        a { color: #0563c1; text-decoration: underline; }
        a:visited { color: #954f72; }
        /* Remove any remaining problematic styles */
        * { position: static !important; transform: none !important; }
    </style>
</head>
<body>
${tempDiv.innerHTML}
</body>
</html>`;

    return sharePointOptimizedHtml;
  };

  const clearContent = () => {
    setSelectedFile(null);
    setHtmlContent('');
    setPreviewContent('');
    setEditMode(false);
    document.getElementById('file-input').value = '';
  };

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>HTML to Word Converter</h1>
          <p>Upload an HTML file or paste HTML content to convert it to a Word document</p>
        </header>

        <div className="main-content">
          <div className="upload-section">
            <div className="file-input-wrapper">
              <input
                id="file-input"
                type="file"
                accept=".html"
                onChange={handleFileChange}
                className="file-input"
              />
              <label htmlFor="file-input" className="file-input-label">
                <span className="file-icon">📁</span>
                Choose HTML File
              </label>
            </div>
            
            {selectedFile && (
              <div className="file-info">
                <span className="file-name">Selected: {selectedFile.name}</span>
              </div>
            )}
          </div>

          <div className="content-section">
            <div className="tabs">
              <button 
                className={`tab ${!editMode ? 'active' : ''}`}
                onClick={() => setEditMode(false)}
              >
                📝 HTML Source
              </button>
              <button 
                className={`tab ${editMode ? 'active' : ''}`}
                onClick={() => setEditMode(true)}
              >
                ✏️ Rich Editor
              </button>
            </div>

            {!editMode ? (
              <div className="input-area">
                <textarea
                  value={htmlContent}
                  onChange={handleHtmlContentChange}
                  placeholder="Paste your HTML content here or upload an HTML file..."
                  className="html-textarea"
                  rows="15"
                />
              </div>
            ) : (
              <div className="editor-area">
                <TipTapEditor
                  content={htmlContent}
                  onChange={handleEditorChange}
                  className="rich-editor"
                />
              </div>
            )}

            <div className="preview-section">
              <h3>📄 Live Preview</h3>
              <div 
                className="html-preview"
                dangerouslySetInnerHTML={{ __html: previewContent }}
              />
            </div>
          </div>

          <div className="converter-options">
            <div className="converter-toggle">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={useCompatibleMode}
                  onChange={(e) => setUseCompatibleMode(e.target.checked)}
                  disabled={isLoading}
                />
                <span className="toggle-text">
                  Use SharePoint-compatible converter {useCompatibleMode ? '✅' : '❌'}
                </span>
              </label>
                              <p className="converter-info">
                  {useCompatibleMode ? (
                    <>🔧 Enhanced SharePoint-compatible mode - optimized for browser editing</>
                  ) : (
                    <>⚡ Standard mode - faster conversion with basic formatting</>
                  )}
                </p>
            </div>
          </div>

          <div className="action-buttons">
            <button
              onClick={convertToWord}
              disabled={!htmlContent.trim() || isLoading}
              className="convert-btn"
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Converting...
                </>
              ) : (
                <>
                  <span className="convert-icon">📄</span>
                  Convert to Word
                </>
              )}
            </button>

            <button
              onClick={clearContent}
              className="clear-btn"
              disabled={isLoading}
            >
              Clear
            </button>
          </div>
        </div>

        <footer className="footer">
          <p>Supports standard HTML tags and basic CSS styling</p>
        </footer>
      </div>
    </div>
  );
}

export default App; 