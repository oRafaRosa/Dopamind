import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Removido import './index.css' para evitar erros de MIME type. O CSS é carregado via CDN no HTML.

console.log("Dopamind: Booting from main.tsx...");

// Error Boundary Simples para envolver a aplicação
class SafeZone extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Dopamind React Crash:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-screen flex-col items-center justify-center bg-background text-red-500 p-8 text-center font-mono">
          <h1 className="text-2xl font-bold mb-4">CRITICAL ERROR</h1>
          <p className="mb-4 text-gray-400">O núcleo do sistema falhou.</p>
          <div className="bg-gray-900 p-4 rounded border border-gray-800 text-xs overflow-auto max-w-full">
            {this.state.error?.toString()}
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-neon-purple text-white rounded hover:bg-purple-600 transition-colors"
          >
            REINICIAR
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const container = document.getElementById('root');

if (container) {
  try {
    const root = ReactDOM.createRoot(container);
    root.render(
      <React.StrictMode>
        <SafeZone>
          <App />
        </SafeZone>
      </React.StrictMode>
    );
  } catch (err) {
    console.error("Failed to create root:", err);
    container.innerHTML = `<div style="color:red; padding:20px; text-align:center;">
      <h3>FALHA DE INICIALIZAÇÃO</h3>
      <p>${err}</p>
    </div>`;
  }
} else {
  console.error("FATAL: Elemento #root não encontrado.");
}