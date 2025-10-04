// src/main.jsx
/*
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Prevent double mounting in development
const rootElement = document.getElementById('root');

if (!rootElement._reactRootContainer) {
  const root = ReactDOM.createRoot(rootElement);
  rootElement._reactRootContainer = root;
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
  */
 // main.jsx
import React from 'react';
import ReactDOMClient from 'react-dom/client';
import App from './App';
import './index.css';

const container = document.getElementById('root');

// Only create root once
if (!window._reactRoot) {
  window._reactRoot = ReactDOMClient.createRoot(container);
}

window._reactRoot.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
