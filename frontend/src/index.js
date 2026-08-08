import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ErrorBoundary from './ErrorBoundary'; // Ensure this path is correct

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  process.env.NODE_ENV === "production" ?
    <ErrorBoundary><App /></ErrorBoundary> : // No StrictMode in production
    <React.StrictMode><ErrorBoundary><App /></ErrorBoundary></React.StrictMode> // StrictMode in development
);

reportWebVitals();