// ReactDOM.render call

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Import App
import './index.css'; // Import global styles

const rootElement = document.getElementById('root');

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App /> {/* No additional BrowserRouter here */}
  </React.StrictMode>
);
