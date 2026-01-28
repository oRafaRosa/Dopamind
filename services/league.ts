import { LeagueTier, WeeklyLeagueStatus } from '../types';

export const LEAGUE_TIERS: LeagueTier[] = [
  { id: 'bronze', name: 'Bronze', minXp: 0, maxXp: 499, colorClass: 'text-amber-700' },
  { id: 'silver', name: 'Silver', minXp: 500, maxXp: 1199, colorClass: 'text-gray-300' },
  { id: 'gold', name: 'Gold', minXp: 1200, maxXp: 2499, colorClass: 'text-yellow-400' },
  { id: 'platinum', name: 'Platinum', minXp: 2500, maxXp: 3999, colorClass: 'text-neon-blue' },
  { id: 'diamond', name: 'Diamond', minXp: 4000, maxXp: 5999, colorClass: 'text-cyan-300' },
  { id: 'ascendant', name: 'Ascendant', minXp: 6000, colorClass: 'text-neon-purple' }
];

export const getWeekStart = (date: Date) => {
  const localDate = new Date(date);
  const day = localDate.getDay(); // 0 (Sun) - 6 (Sat)
  const diff = (day + 6) % 7; // Monday start
  localDate.setDate(localDate.getDate() - diff);
  localDate.setHours(0, 0, 0, 0);
  return localDate;
};

export const getWeekEnd = (date: Date) => {
  const start = getWeekStart(date);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
};

export const getLeagueTier = (weeklyXp: number) => {
  const found = [...LEAGUE_TIERS].reverse().find((tier) => weeklyXp >= tier.minXp);
  return found || LEAGUE_TIERS[0];
};

export const buildWeeklyStatus = (weeklyXp: number, now: Date = new Date()): WeeklyLeagueStatus => {
  const tier = getLeagueTier(weeklyXp);
  const weekStart = getWeekStart(now);
  const weekEnd = getWeekEnd(now);
  const currentTierIndex = LEAGUE_TIERS.findIndex((item) => item.id === tier.id);
  const nextTier = LEAGUE_TIERS[currentTierIndex + 1];

  const maxForTier = tier.maxXp ?? (nextTier ? nextTier.minXp - 1 : weeklyXp);
  const progressToNext = nextTier ? Math.min(100, Math.round(((weeklyXp - tier.minXp) / (nextTier.minXp - tier.minXp)) * 100)) : 100;

  return {
    tier,
    weeklyXp,
    weekStart: weekStart.toISOString().split('T')[0],
    weekEnd: weekEnd.toISOString().split('T')[0],
    progressToNext,
    nextTier
  };
};

const getWeeklyStorageKey = (userId: string, weekStartIso: string) => `dopamind_weekly_xp_${userId}_${weekStartIso}`;

export const addWeeklyXpLocal = (userId: string, amount: number) => {
  if (typeof window === 'undefined') return;
  const weekStart = getWeekStart(new Date()).toISOString().split('T')[0];
  const key = getWeeklyStorageKey(userId, weekStart);
  const current = Number(window.localStorage.getItem(key) || '0');
  window.localStorage.setItem(key, String(current + amount));
};

export const getWeeklyXpLocal = (userId: string) => {
  if (typeof window === 'undefined') return 0;
  const weekStart = getWeekStart(new Date()).toISOString().split('T')[0];
  const key = getWeeklyStorageKey(userId, weekStart);
  return Number(window.localStorage.getItem(key) || '0');
};
