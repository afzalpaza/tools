# HTML to Word Converter

A simple React application that converts HTML files to Word documents (.docx). Upload an HTML file or paste HTML content directly to generate a downloadable Word document.

## Features

- **File Upload**: Upload HTML files directly from your computer
- **Manual Input**: Paste or type HTML content manually
- **Live Preview**: See how your HTML will look before conversion
- **Instant Download**: Convert and download Word documents with one click
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, intuitive interface with smooth animations

## Technologies Used

- React 18
- html-docx-js (for HTML to Word conversion)
- file-saver (for file downloads)
- Modern CSS with gradients and animations

## Installation

1. **Clone or navigate to the project directory**

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Open your browser** and go to `http://localhost:3000`

## Usage

### Method 1: Upload HTML File
1. Click the "Choose HTML File" button
2. Select an HTML file from your computer
3. The content will automatically load into the editor
4. Click "Convert to Word" to download the Word document

### Method 2: Manual Input
1. Paste or type your HTML content in the textarea
2. See the live preview on the right side
3. Click "Convert to Word" to download the Word document

### Supported HTML Features

The converter supports most standard HTML tags including:
- Headers (h1, h2, h3, etc.)
- Paragraphs (p)
- Lists (ul, ol, li)
- Text formatting (strong, em, u)
- Links (a)
- Images (img)
- Tables (table, tr, td, th)
- Divs and spans with basic styling

## Project Structure

```
html-to-word/
├── public/
│   └── index.html
├── src/
│   ├── App.js          # Main component
│   ├── App.css         # Styles
│   ├── index.js        # Entry point
│   └── index.css       # Global styles
├── package.json
└── README.md
```

## Available Scripts

- `npm start` - Run the app in development mode
- `npm build` - Build the app for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App (not recommended)

## Browser Support

This application works in all modern browsers that support:
- ES6+ JavaScript features
- CSS Grid and Flexbox
- File API
- Blob API

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the MIT License. 