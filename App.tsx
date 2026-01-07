import React from 'react';
import Layout, { HashRouter, Routes, Route, Navigate } from './components/Layout';
import Auth from './pages/Auth';
import Home from './pages/Home';
import Challenges from './pages/Challenges';
import ChallengeDetail from './pages/ChallengeDetail';
import CreateChallenge from './pages/CreateChallenge';
import Ranking from './pages/Ranking';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import About from './pages/About';
import XPHistory from './pages/XPHistory';
import Shop from './pages/Shop';
import Friends from './pages/Friends';

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/signup" element={<Auth />} />
        
        {/* Protected Routes - Flattened for Simple Router */}
        <Route path="/app/home" element={<Layout><Home /></Layout>} />
        
        {/* Order matters: Specific routes first */}
        <Route path="/app/challenges/create" element={<Layout><CreateChallenge /></Layout>} />
        <Route path="/app/challenges/:id" element={<Layout><ChallengeDetail /></Layout>} />
        <Route path="/app/challenges" element={<Layout><Challenges /></Layout>} />
        
        <Route path="/app/ranking" element={<Layout><Ranking /></Layout>} />
        <Route path="/app/shop" element={<Layout><Shop /></Layout>} />
        <Route path="/app/friends" element={<Layout><Friends /></Layout>} />
        
        <Route path="/app/profile/settings" element={<Layout><Settings /></Layout>} />
        <Route path="/app/profile/history" element={<Layout><XPHistory /></Layout>} />
        <Route path="/app/profile" element={<Layout><Profile /></Layout>} />
        
        <Route path="/app/about" element={<Layout><About /></Layout>} />
        
        {/* Redirects */}
        <Route path="/app/*" element={<Navigate to="/app/home" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;