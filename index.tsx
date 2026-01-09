import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Importante: Importar o CSS para o Vite processar o Tailwind

const container = document.getElementById('root');

if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("ERRO CRÍTICO: Elemento #root não encontrado no DOM.");
}