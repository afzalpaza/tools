import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import htmlDocx from 'html-docx-js/dist/html-docx';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [htmlContent, setHtmlContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previewContent, setPreviewContent] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/html') {
      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        setHtmlContent(content);
        setPreviewContent(content);
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

  const convertToWord = () => {
    if (!htmlContent.trim()) {
      alert('Please provide HTML content to convert');
      return;
    }

    setIsLoading(true);

    try {
      // Process HTML to improve Word conversion
      const processedHtml = processHtmlForWord(htmlContent);
      
      // Convert HTML to Word document
      const converted = htmlDocx.asBlob(processedHtml);
      
      // Generate filename
      const filename = selectedFile 
        ? selectedFile.name.replace('.html', '.docx')
        : 'converted-document.docx';

      // Save the file
      saveAs(converted, filename);
    } catch (error) {
      console.error('Conversion error:', error);
      alert('Error converting HTML to Word. Please check your HTML content.');
    } finally {
      setIsLoading(false);
    }
  };

  const processHtmlForWord = (html) => {
    // Clean up and process HTML for better Word conversion
    let processedHtml = html;

    // Remove or replace problematic page-break CSS properties that cause multiple file generation
    processedHtml = processedHtml.replace(/page-break-before\s*:\s*always\s*;?/gi, 'margin-top: 40px;');
    processedHtml = processedHtml.replace(/page-break-after\s*:\s*always\s*;?/gi, 'margin-bottom: 40px;');
    processedHtml = processedHtml.replace(/page-break-inside\s*:\s*avoid\s*;?/gi, '');

    // Create a temporary div to manipulate the DOM
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = processedHtml;

    // Add line breaks and spacing for better Word formatting
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

    // Create the final HTML with proper structure and styling
    const finalHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: "Times New Roman", serif;
            font-size: 12pt;
            line-height: 1.5;
            color: black;
        }
        h1 {
            font-size: 24pt;
            font-weight: bold;
            margin: 24pt 0 12pt 0;
            color: black;
        }
        h2 {
            font-size: 18pt;
            font-weight: bold;
            margin: 18pt 0 10pt 0;
            color: black;
        }
        h3 {
            font-size: 16pt;
            font-weight: bold;
            margin: 16pt 0 8pt 0;
            color: black;
        }
        h4, h5, h6 {
            font-size: 14pt;
            font-weight: bold;
            margin: 14pt 0 6pt 0;
            color: black;
        }
        p {
            margin: 0 0 12pt 0;
            text-align: left;
        }
        ul, ol {
            margin: 12pt 0;
            padding-left: 36pt;
        }
        li {
            margin: 3pt 0;
        }
        // table {
        //     border-collapse: collapse;
        //     width: 100%;
        //     margin: 12pt 0;
        // }
        // th, td {
        //     border: 1pt solid black;
        //     padding: 8pt;
        //     text-align: left;
        //     vertical-align: top;
        // }
        // th {
        //     background-color: #f0f0f0;
        //     font-weight: bold;
        // }
        blockquote {
            margin: 12pt 0 12pt 36pt;
            padding-left: 12pt;
            border-left: 3pt solid #ccc;
            font-style: italic;
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
            color: blue;
            text-decoration: underline;
        }
        .highlight {
            background-color: yellow;
        }
        .important {
            color: red;
            font-weight: bold;
        }
    </style>
</head>
<body>
${tempDiv.innerHTML}
</body>
</html>`;

    return finalHtml;
  };

  const clearContent = () => {
    setSelectedFile(null);
    setHtmlContent('');
    setPreviewContent('');
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
            <div className="input-area">
              <h3>HTML Content</h3>
              <textarea
                value={htmlContent}
                onChange={handleHtmlContentChange}
                placeholder="Paste your HTML content here or upload an HTML file..."
                className="html-textarea"
                rows="12"
              />
            </div>

            <div className="preview-area">
              <h3>Preview</h3>
              <div 
                className="html-preview"
                dangerouslySetInnerHTML={{ __html: previewContent }}
              />
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