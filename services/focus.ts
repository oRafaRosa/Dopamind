import { FocusSession } from '../types';

const STORAGE_KEY_SESSIONS = (userId: string) => `dopamind_focus_sessions_${userId}`;

export const saveFocusSession = (userId: string, session: Omit<FocusSession, 'id'>): FocusSession => {
  if (typeof window === 'undefined') {
    return { ...session, id: Date.now().toString() };
  }
  
  const sessions = getFocusSessions(userId);
  const newSession: FocusSession = {
    ...session,
    id: Date.now().toString()
  };
  
  sessions.push(newSession);
  
  // Keep only last 100 sessions
  const trimmed = sessions.slice(-100);
  window.localStorage.setItem(STORAGE_KEY_SESSIONS(userId), JSON.stringify(trimmed));
  
  return newSession;
};

export const getFocusSessions = (userId: string, limit?: number): FocusSession[] => {
  if (typeof window === 'undefined') return [];
  
  const stored = window.localStorage.getItem(STORAGE_KEY_SESSIONS(userId));
  if (!stored) return [];
  
  const sessions: FocusSession[] = JSON.parse(stored);
  
  // Sort by most recent first
  sessions.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
  
  return limit ? sessions.slice(0, limit) : sessions;
};

export const getTodayFocusSessions = (userId: string): FocusSession[] => {
  const sessions = getFocusSessions(userId);
  const today = new Date().toISOString().split('T')[0];
  
  return sessions.filter(session => {
    const sessionDate = new Date(session.completedAt).toISOString().split('T')[0];
    return sessionDate === today;
  });
};

export const getTotalFocusTime = (userId: string, days?: number): number => {
  const sessions = getFocusSessions(userId);
  
  if (!days) {
    return sessions.reduce((total, session) => total + session.duration, 0);
  }
  
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  
  return sessions
    .filter(session => new Date(session.completedAt) >= cutoff)
    .reduce((total, session) => total + session.duration, 0);
};

export const calculateFocusXp = (durationInSeconds: number): number => {
  // Base: 1 XP per minute (60 seconds)
  const baseXp = Math.floor(durationInSeconds / 60);
  
  // Bonus for longer sessions
  let bonus = 0;
  if (durationInSeconds >= 25 * 60) { // 25+ min
    bonus = 25;
  } else if (durationInSeconds >= 50 * 60) { // 50+ min
    bonus = 75;
  } else if (durationInSeconds >= 90 * 60) { // 90+ min
    bonus = 150;
  }
  
  return baseXp + bonus;
};

export const getFocusStreak = (userId: string): number => {
  const sessions = getFocusSessions(userId);
  if (sessions.length === 0) return 0;
  
  let streak = 0;
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    const dateStr = checkDate.toISOString().split('T')[0];
    
    const hasSession = sessions.some(session => {
      const sessionDate = new Date(session.completedAt).toISOString().split('T')[0];
      return sessionDate === dateStr && session.duration >= 25 * 60; // At least 25 min
    });
    
    if (hasSession) {
      streak++;
    } else if (i > 0) {
      // Allow skip today but break on first miss in past
      break;
    }
  }
  
  return streak;
};
