import { supabase } from './supabaseClient';

export interface BossRaid {
  id: string;
  name: string;
  description: string;
  total_hp: number;
  current_hp: number;
  week_start: string;
  week_end: string;
  status: 'active' | 'defeated' | 'escaped';
  reward_xp: number;
  reward_credits: number;
  reward_tickets: number;
  participants?: number;
  user_damage?: number;
}

export interface BossContribution {
  id: string;
  boss_raid_id: string;
  user_id: string;
  damage_dealt: number;
  tasks_completed: number;
  focus_minutes: number;
  last_contribution_at: string;
}

// --- GET ACTIVE BOSS ---

export const getActiveBossRaid = async (): Promise<BossRaid | null> => {
  try {
    const { data: boss, error } = await supabase
      .from('boss_raids')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching active boss:', error);
      return null;
    }

    if (!boss) return null;

    // Get participant count
    const { count } = await supabase
      .from('boss_raid_contributions')
      .select('*', { count: 'exact', head: true })
      .eq('boss_raid_id', boss.id);

    return {
      ...boss,
      participants: count || 0
    };
  } catch (error) {
    console.error('Error in getActiveBossRaid:', error);
    return null;
  }
};

// --- GET USER CONTRIBUTION ---

export const getUserBossContribution = async (
  bossRaidId: string,
  userId: string
): Promise<BossContribution | null> => {
  try {
    const { data, error } = await supabase
      .from('boss_raid_contributions')
      .select('*')
      .eq('boss_raid_id', bossRaidId)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Error fetching user contribution:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getUserBossContribution:', error);
    return null;
  }
};

// --- DEAL DAMAGE TO BOSS ---

export const dealBossDamage = async (
  bossRaidId: string,
  userId: string,
  damage: number,
  taskIncrement: number = 0,
  focusMinutes: number = 0
): Promise<{ success: boolean; new_hp: number; defeated: boolean } | null> => {
  try {
    // Call the Supabase function to deal damage
    const { data, error } = await supabase.rpc('deal_boss_damage', {
      p_boss_raid_id: bossRaidId,
      p_user_id: userId,
      p_damage: damage,
      p_task_increment: taskIncrement,
      p_focus_minutes: focusMinutes
    });

    if (error) {
      console.error('Error dealing boss damage:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in dealBossDamage:', error);
    return null;
  }
};

// --- GET TOP CONTRIBUTORS ---

export const getTopContributors = async (
  bossRaidId: string,
  limit: number = 10
): Promise<Array<BossContribution & { username: string; avatar_url?: string }>> => {
  try {
    const { data, error } = await supabase
      .from('boss_raid_contributions')
      .select(`
        *,
        profiles:user_id (
          username,
          avatar_url
        )
      `)
      .eq('boss_raid_id', bossRaidId)
      .order('damage_dealt', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching top contributors:', error);
      return [];
    }

    return data.map(contribution => ({
      ...contribution,
      username: contribution.profiles?.username || 'Unknown',
      avatar_url: contribution.profiles?.avatar_url
    }));
  } catch (error) {
    console.error('Error in getTopContributors:', error);
    return [];
  }
};

// --- CALCULATE DAMAGE FROM XP ---

export const calculateBossDamage = (xpGained: number): number => {
  // 10 XP = 1 damage
  return Math.floor(xpGained / 10);
};

// --- CHECK AND AWARD REWARDS ---

export const checkAndAwardBossReward = async (
  bossRaidId: string,
  userId: string
): Promise<{ awarded: boolean; xp: number; credits: number; tickets: number } | null> => {
  try {
    // Get boss details
    const { data: boss, error: bossError } = await supabase
      .from('boss_raids')
      .select('*')
      .eq('id', bossRaidId)
      .single();

    if (bossError || !boss || boss.status !== 'defeated') {
      return null;
    }

    // Check if user already claimed reward
    const { data: history, error: historyError } = await supabase
      .from('boss_raid_history')
      .select('*')
      .eq('boss_raid_id', bossRaidId)
      .eq('user_id', userId)
      .single();

    if (historyError && historyError.code !== 'PGRST116') {
      console.error('Error checking boss history:', historyError);
      return null;
    }

    // If already claimed, return existing reward
    if (history && history.reward_claimed) {
      return {
        awarded: false,
        xp: 0,
        credits: 0,
        tickets: 0
      };
    }

    // Get user contribution
    const contribution = await getUserBossContribution(bossRaidId, userId);
    
    if (!contribution || contribution.damage_dealt === 0) {
      return null; // User didn't participate
    }

    // Calculate reward based on contribution
    const baseXp = boss.reward_xp;
    const baseCredits = boss.reward_credits;
    const baseTickets = boss.reward_tickets;

    // Bonus multiplier based on damage (top contributors get more)
    const contributionPercent = (contribution.damage_dealt / boss.total_hp) * 100;
    let multiplier = 1;
    
    if (contributionPercent >= 10) multiplier = 2; // Top 10% HP damage
    else if (contributionPercent >= 5) multiplier = 1.5;
    else if (contributionPercent >= 1) multiplier = 1.25;

    const rewardXp = Math.floor(baseXp * multiplier);
    const rewardCredits = Math.floor(baseCredits * multiplier);
    const rewardTickets = baseTickets;

    // Save to history
    const { error: insertError } = await supabase
      .from('boss_raid_history')
      .insert({
        boss_raid_id: bossRaidId,
        user_id: userId,
        damage_dealt: contribution.damage_dealt,
        reward_claimed: true
      });

    if (insertError) {
      console.error('Error saving boss history:', insertError);
    }

    return {
      awarded: true,
      xp: rewardXp,
      credits: rewardCredits,
      tickets: rewardTickets
    };
  } catch (error) {
    console.error('Error in checkAndAwardBossReward:', error);
    return null;
  }
};

// --- CREATE NEW BOSS RAID (Admin function) ---

export const createBossRaid = async (
  name: string,
  description: string,
  totalHp: number,
  weekStart: Date,
  weekEnd: Date
): Promise<BossRaid | null> => {
  try {
    const { data, error } = await supabase
      .from('boss_raids')
      .insert({
        name,
        description,
        total_hp: totalHp,
        current_hp: totalHp,
        week_start: weekStart.toISOString(),
        week_end: weekEnd.toISOString(),
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating boss raid:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in createBossRaid:', error);
    return null;
  }
};

// --- GET TIME LEFT ---

export const getBossTimeLeft = (weekEnd: string): string => {
  const now = new Date();
  const end = new Date(weekEnd);
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return 'Encerrado';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) return `${days}d ${hours}h`;
  return `${hours}h`;
};
