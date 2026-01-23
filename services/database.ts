import { supabase } from './supabaseClient';
import { Profile, Task, Challenge, LedgerEntry, Badge, DayLog } from '../types';

// Profile operations
export const getProfile = async (userId: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
};

export const updateProfile = async (userId: string, updates: Partial<Profile>): Promise<boolean> => {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);

  if (error) {
    console.error('Error updating profile:', error);
    return false;
  }

  return true;
};

// Task operations
export const getTasks = async (userId: string): Promise<Task[]> => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }

  return data || [];
};

export const createTask = async (task: Omit<Task, 'id'> & { user_id: string }): Promise<Task | null> => {
  const { data, error } = await supabase
    .from('tasks')
    .insert(task)
    .select()
    .single();

  if (error) {
    console.error('Error creating task:', error);
    return null;
  }

  return data;
};

export const updateTask = async (taskId: string, updates: Partial<Task>): Promise<boolean> => {
  const { error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId);

  if (error) {
    console.error('Error updating task:', error);
    return false;
  }

  return true;
};

// Challenge operations
export const getChallenges = async (): Promise<Challenge[]> => {
  const { data, error } = await supabase
    .from('challenges')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching challenges:', error);
    return [];
  }

  return data || [];
};

export const joinChallenge = async (challengeId: string, userId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('challenge_participants')
    .insert({ challenge_id: challengeId, user_id: userId });

  if (error) {
    console.error('Error joining challenge:', error);
    return false;
  }

  return true;
};

// XP History operations
export const getXpHistory = async (userId: string): Promise<LedgerEntry[]> => {
  const { data, error } = await supabase
    .from('xp_history')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching XP history:', error);
    return [];
  }

  return data?.map(entry => ({
    id: entry.id,
    source: entry.source,
    amount: entry.amount,
    date: entry.date,
    type: entry.amount > 0 ? 'gain' : 'loss'
  })) || [];
};

export const addXpEntry = async (userId: string, source: string, amount: number): Promise<boolean> => {
  const { error } = await supabase
    .from('xp_history')
    .insert({ user_id: userId, source, amount });

  if (error) {
    console.error('Error adding XP entry:', error);
    return false;
  }

  return true;
};

// Badge operations
export const getBadges = async (userId: string): Promise<Badge[]> => {
  const { data, error } = await supabase
    .from('badges')
    .select('*')
    .eq('user_id', userId)
    .order('unlocked_at', { ascending: false });

  if (error) {
    console.error('Error fetching badges:', error);
    return [];
  }

  return data || [];
};

export const unlockBadge = async (userId: string, badge: Omit<Badge, 'id' | 'user_id' | 'unlocked_at'>): Promise<boolean> => {
  const { error } = await supabase
    .from('badges')
    .insert({
      user_id: userId,
      ...badge,
      unlocked_at: new Date().toISOString()
    });

  if (error) {
    console.error('Error unlocking badge:', error);
    return false;
  }

  return true;
};

// Day Log operations
export const getDayLogs = async (userId: string): Promise<DayLog[]> => {
  const { data, error } = await supabase
    .from('day_logs')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching day logs:', error);
    return [];
  }

  return data || [];
};

export const updateDayLog = async (userId: string, date: string, status: string, xpEarned: number): Promise<boolean> => {
  const { error } = await supabase
    .from('day_logs')
    .upsert({
      user_id: userId,
      date,
      status,
      xp_earned: xpEarned
    });

  if (error) {
    console.error('Error updating day log:', error);
    return false;
  }

  return true;
};

// Roulette Ticket operations
export const consumeRouletteTicket = async (userId: string): Promise<boolean> => {
  // Get current tickets
  const { data: profile, error: fetchError } = await supabase
    .from('profiles')
    .select('roulette_tickets')
    .eq('id', userId)
    .single();

  if (fetchError || !profile || profile.roulette_tickets <= 0) {
    console.error('Error consuming ticket or insufficient tickets:', fetchError);
    return false;
  }

  // Decrement tickets
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ roulette_tickets: profile.roulette_tickets - 1 })
    .eq('id', userId);

  if (updateError) {
    console.error('Error updating tickets:', updateError);
    return false;
  }

  return true;
};

export const addRouletteTickets = async (userId: string, amount: number): Promise<boolean> => {
  const { data: profile, error: fetchError } = await supabase
    .from('profiles')
    .select('roulette_tickets')
    .eq('id', userId)
    .single();

  if (fetchError || !profile) {
    console.error('Error fetching profile for ticket addition:', fetchError);
    return false;
  }

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ roulette_tickets: profile.roulette_tickets + amount })
    .eq('id', userId);

  if (updateError) {
    console.error('Error adding tickets:', updateError);
    return false;
  }

  return true;
};

export const saveRouletteHistory = async (entry: Omit<any, 'id' | 'created_at'>): Promise<boolean> => {
  const { error } = await supabase
    .from('roulette_history')
    .insert(entry);

  if (error) {
    console.error('Error saving roulette history:', error);
    return false;
  }

  return true;
};

export const getRouletteHistory = async (userId: string, limit: number = 10): Promise<any[]> => {
  const { data, error } = await supabase
    .from('roulette_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching roulette history:', error);
    return [];
  }

  return data || [];
};

export const checkDailyLoginBonus = async (userId: string): Promise<boolean> => {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('last_login_date, roulette_tickets')
    .eq('id', userId)
    .single();

  if (error || !profile) {
    console.error('Error checking daily bonus:', error);
    return false;
  }

  const today = new Date().toISOString().split('T')[0];
  const lastLogin = profile.last_login_date;

  // If last login was not today, award bonus
  if (lastLogin !== today) {
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        last_login_date: today,
        roulette_tickets: profile.roulette_tickets + 1
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Error awarding daily bonus:', updateError);
      return false;
    }

    return true; // Bonus awarded
  }

  return false; // Already claimed today
};