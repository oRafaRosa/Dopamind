import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

// Importando componentes e páginas (assumindo que existem e os caminhos estão corretos)
import Layout from './components/Layout';
import Auth from './pages/Auth';
import Home from './pages/Home';
import Challenges from './pages/Challenges';
import Ranking from './pages/Ranking';
import Profile from './pages/Profile';
import Nexus from './pages/Nexus';
import Friends from './pages/Friends';

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Auth />} />
        
        {/* Protected Area */}
        <Route path="/app/home" element={<Layout><Home /></Layout>} />
        <Route path="/app/challenges" element={<Layout><Challenges /></Layout>} />
        <Route path="/app/nexus" element={<Layout><Nexus /></Layout>} />
        <Route path="/app/friends" element={<Layout><Friends /></Layout>} />
        <Route path="/app/ranking" element={<Layout><Ranking /></Layout>} />
        <Route path="/app/profile" element={<Layout><Profile /></Layout>} />
        
        {/* Fallbacks */}
        <Route path="/app/*" element={<Navigate to="/app/home" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </HashRouter>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}