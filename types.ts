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
  is_pro: boolean;
  total_xp: number;
  aura_level: number;
  streak: number;
  credits: number;
  stats: UserStats; // New RPG Stats
}

export interface Task {
  id: string;
  title: string;
  category: 'Body' | 'Mind' | 'Spirit' | 'Work' | 'Life';
  xp: number;
  is_completed: boolean;
  requires_evidence?: boolean;
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
  badges: number; // Added to show achievement count in ranking
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
  unlocked_at?: string; // null if locked
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'cosmetic' | 'utility' | 'boost';
  icon_name: string;
  owned: boolean;
}

export interface Friend {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  status: 'online' | 'offline' | 'busy';
  aura_level: number;
}