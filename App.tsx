import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import Layout from './components/Layout';

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/signup" element={<Auth />} />
        
        {/* Protected Routes */}
        <Route path="/app/*" element={
          <Layout>
            <Routes>
              <Route path="home" element={<Home />} />
              <Route path="challenges" element={<Challenges />} />
              <Route path="challenges/create" element={<CreateChallenge />} />
              <Route path="challenges/:id" element={<ChallengeDetail />} />
              <Route path="ranking" element={<Ranking />} />
              <Route path="shop" element={<Shop />} />
              <Route path="friends" element={<Friends />} />
              <Route path="profile" element={<Profile />} />
              <Route path="profile/settings" element={<Settings />} />
              <Route path="about" element={<About />} />
              <Route path="profile/history" element={<XPHistory />} />
              <Route path="*" element={<Navigate to="/app/home" replace />} />
            </Routes>
          </Layout>
        } />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;