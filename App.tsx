import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
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
import Roulette from './pages/Roulette';
import PowerHour from './pages/PowerHour';
import { supabase } from './services/supabaseClient';

console.log(" [App.tsx] Module loaded.");

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App = () => {
  console.log(" [App.tsx] Component rendering...");
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/signup" element={<Auth />} />

        {/* Protected Routes */}
        <Route path="/app/home" element={<ProtectedRoute><Layout><Home /></Layout></ProtectedRoute>} />

        {/* Nexus Tools */}
        <Route path="/app/nexus" element={<ProtectedRoute><Layout><Nexus /></Layout></ProtectedRoute>} />
        <Route path="/app/focus" element={<ProtectedRoute><FocusMode /></ProtectedRoute>} /> {/* Fullscreen mode, no layout */}
        <Route path="/app/skills" element={<ProtectedRoute><SkillTree /></ProtectedRoute>} /> {/* Fullscreen mode */}
        <Route path="/app/logs" element={<ProtectedRoute><Layout><SystemLogs /></Layout></ProtectedRoute>} />
        <Route path="/app/oracle" element={<ProtectedRoute><Layout><Oracle /></Layout></ProtectedRoute>} />
        <Route path="/app/pvp" element={<ProtectedRoute><Layout><PvpDuel /></Layout></ProtectedRoute>} />
        <Route path="/app/roulette" element={<ProtectedRoute><Layout><Roulette /></Layout></ProtectedRoute>} />
        <Route path="/app/power-hour" element={<ProtectedRoute><PowerHour /></ProtectedRoute>} /> {/* Fullscreen */}

        <Route path="/app/challenges/create" element={<ProtectedRoute><Layout><CreateChallenge /></Layout></ProtectedRoute>} />
        <Route path="/app/challenges/:id" element={<ProtectedRoute><Layout><ChallengeDetail /></Layout></ProtectedRoute>} />
        <Route path="/app/challenges" element={<ProtectedRoute><Layout><Challenges /></Layout></ProtectedRoute>} />

        <Route path="/app/ranking" element={<ProtectedRoute><Layout><Ranking /></Layout></ProtectedRoute>} />
        <Route path="/app/shop" element={<ProtectedRoute><Layout><Shop /></Layout></ProtectedRoute>} />
        <Route path="/app/friends" element={<ProtectedRoute><Layout><Friends /></Layout></ProtectedRoute>} />

        <Route path="/app/profile/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />
        <Route path="/app/profile/history" element={<ProtectedRoute><Layout><XPHistory /></Layout></ProtectedRoute>} />
        <Route path="/app/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />

        <Route path="/app/about" element={<ProtectedRoute><Layout><About /></Layout></ProtectedRoute>} />

        {/* Redirects */}
        <Route path="/app/*" element={<Navigate to="/app/home" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;