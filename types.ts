
export interface UserStats {
  str: number; // Strength (Body)
  int: number; // Intellect (Mind)
  foc: number; // Focus (Work)
  spi: number; // Spirit (Spirit)
  cha: number; // Charisma (Life)
}

export interface Profile {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  is_pro?: boolean; // Opcional pois pode não existir na tabela atual
  total_xp: number;
  aura_level: number;
  streak: number;
  credits: number;
  stats: UserStats;
  roulette_tickets: number;
  last_login_date?: string;
  power_hour_combo: number;
}

export type TaskCategory = 'Body' | 'Mind' | 'Spirit' | 'Work' | 'Life';

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  xp: number;
  is_completed: boolean;
  requires_evidence?: boolean;
  grants_ticket?: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  duration_days: number;
  difficulty: 'Casual' | 'Hard Mode';
  reward_xp: number;
  pro_only: boolean;
  participants: number;
  joined?: boolean;
  rules?: string[];
}

export interface RankingUser {
  id: string;
  username: string;
  avatar_url?: string;
  aura_level: number;
  total_xp: number;
  is_pro: boolean;
  rank: number;
  badges: number;
  streak: number; // Added for state calculation
}

export interface LedgerEntry {
  id: string;
  source: string;
  amount: number;
  date: string;
  type: 'gain' | 'loss';
}

export interface Badge {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon_name: string;
  unlocked_at?: string;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'cosmetic' | 'utility' | 'boost';
  icon_name: string;
  owned: boolean;
  effect?: ShopItemEffect;
}

export interface ShopItemEffect {
  type: 'streak_freeze' | 'xp_boost' | 'cosmetic';
  duration?: number; // in hours
  multiplier?: number; // e.g., 1.2 for 20% boost
}

export interface ActiveItem {
  itemId: string;
  itemName: string;
  effect: ShopItemEffect;
  activatedAt: string;
  expiresAt: string;
}

export interface FocusSession {
  id: string;
  userId: string;
  duration: number; // in seconds
  xpEarned: number;
  startedAt: string;
  completedAt: string;
  type: 'focus' | 'break';
}

// --- LAYERED GOALS SYSTEM ---

export type GoalPeriod = 'daily' | 'weekly' | 'seasonal';
export type GoalType = 'complete_tasks' | 'earn_xp' | 'focus_time' | 'maintain_streak' | 'complete_category';

export interface GoalRequirement {
  type: GoalType;
  target: number;
  category?: TaskCategory; // For category-specific goals
}

export interface GoalReward {
  xp: number;
  credits: number;
  tickets?: number;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  period: GoalPeriod;
  requirement: GoalRequirement;
  reward: GoalReward;
  progress: number;
  completed: boolean;
  expiresAt: string;
}

export interface Friend {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  status: 'online' | 'offline' | 'busy';
  aura_level: number;
}

export interface DayLog {
  date: string;
  status: 'perfect' | 'active' | 'inactive';
  xp_earned: number;
}

// --- ARCHETYPES & PERKS ---

export type ArchetypeId = 'warrior' | 'sage' | 'monk' | 'architect' | 'bard' | 'hybrid';

export interface ArchetypePerkEffect {
  xpMultiplier?: number;
  creditsMultiplier?: number;
  category?: TaskCategory;
}

export interface ArchetypePerk {
  id: string;
  title: string;
  description: string;
  effect: ArchetypePerkEffect;
}

export interface Archetype {
  id: ArchetypeId;
  name: string;
  description: string;
  focus: TaskCategory | 'Balanced';
  colorClass: string;
  perks: ArchetypePerk[];
}

// --- WEEKLY LEAGUES ---

export interface LeagueTier {
  id: string;
  name: string;
  minXp: number;
  maxXp?: number;
  colorClass: string;
}

export interface WeeklyLeagueStatus {
  tier: LeagueTier;
  weeklyXp: number;
  weekStart: string;
  weekEnd: string;
  progressToNext: number;
  nextTier?: LeagueTier;
}

// --- NEW TYPES ---

export interface SkillNode {
  id: string;
  name: string;
  description: string;
  cost: number;
  req_stat: 'str' | 'int' | 'foc' | 'spi' | 'cha';
  req_value: number;
  unlocked: boolean;
  icon: string;
  position: { x: number; y: number }; // Percentage 0-100
  parentId?: string;
}

export interface BossRaid {
  name: string;
  description: string;
  total_hp: number;
  current_hp: number;
  time_left: string;
  participants: number;
  reward_credits: number;
}

export interface SystemLogEntry {
  id: string;
  date: string;
  content: string;
  ai_feedback: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'oracle';
  text: string;
}

export interface RouletteHistoryEntry {
  id: string;
  user_id: string;
  challenge_text: string;
  challenge_type: string;
  xp_reward: number;
  tickets_won: number;
  created_at: string;
}

// --- AURA LOGIC ---

export type AuraState = 'Unstable' | 'Stable' | 'Elevated' | 'Dominant';

export const getAuraConfig = (streak: number) => {
  if (streak < 3) {
    return {
      state: 'Unstable' as AuraState,
      color: 'text-red-500',
      border: 'border-red-500',
      bg: 'bg-red-500/10',
      shadow: 'shadow-red-500/20'
    };
  }
  if (streak < 14) {
    return {
      state: 'Stable' as AuraState,
      color: 'text-blue-400',
      border: 'border-blue-400',
      bg: 'bg-blue-400/10',
      shadow: 'shadow-blue-400/20'
    };
  }
  if (streak < 30) {
    return {
      state: 'Elevated' as AuraState,
      color: 'text-neon-purple',
      border: 'border-neon-purple',
      bg: 'bg-neon-purple/10',
      shadow: 'shadow-neon-purple/20'
    };
  }
  return {
    state: 'Dominant' as AuraState,
    color: 'text-yellow-400',
    border: 'border-yellow-400',
    bg: 'bg-yellow-400/10',
    shadow: 'shadow-yellow-400/50'
  };
};
