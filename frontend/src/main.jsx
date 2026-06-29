import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Mandates @tailwind components directives setup inside stylesheet 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);