import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Assuming a global CSS file (e.g., for Tailwind CSS) is present in the project.
// If not, this can be removed, but the UI styling will be affected.
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
