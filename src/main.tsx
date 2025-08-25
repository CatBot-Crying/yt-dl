import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// The '!' at the end tells TypeScript that we are sure this element exists.
const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
