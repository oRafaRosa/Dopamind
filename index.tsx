import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log("Dopamind: Booting from index.tsx...");

const container = document.getElementById('root');

if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("FATAL: Elemento #root não encontrado.");
}