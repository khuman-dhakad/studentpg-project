import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Loads main styles and Tailwind styles for the website layout

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);