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
import Nexus from './pages/Nexus';
import FocusMode from './pages/FocusMode';
import SkillTree from './pages/SkillTree';
import SystemLogs from './pages/SystemLogs';
import Oracle from './pages/Oracle';
import PvpDuel from './pages/PvpDuel';

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/signup" element={<Auth />} />
        
        {/* Protected Routes */}
        <Route path="/app/home" element={<Layout><Home /></Layout>} />
        
        {/* Nexus Tools */}
        <Route path="/app/nexus" element={<Layout><Nexus /></Layout>} />
        <Route path="/app/focus" element={<FocusMode />} /> {/* Fullscreen mode, no layout */}
        <Route path="/app/skills" element={<SkillTree />} /> {/* Fullscreen mode */}
        <Route path="/app/logs" element={<Layout><SystemLogs /></Layout>} />
        <Route path="/app/oracle" element={<Layout><Oracle /></Layout>} />
        <Route path="/app/pvp" element={<Layout><PvpDuel /></Layout>} />
        
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