-- Boss Raids System Migration
-- Creates tables for weekly boss raids with shared HP and player contributions

-- 1. Boss Raids Table (Active weekly boss)
CREATE TABLE IF NOT EXISTS boss_raids (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  total_hp INTEGER NOT NULL,
  current_hp INTEGER NOT NULL DEFAULT 0,
  week_start TIMESTAMP WITH TIME ZONE NOT NULL,
  week_end TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active', -- active, defeated, escaped
  reward_xp INTEGER NOT NULL DEFAULT 100,
  reward_credits INTEGER NOT NULL DEFAULT 50,
  reward_tickets INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Boss Raid Contributions Table (Player damage tracking)
CREATE TABLE IF NOT EXISTS boss_raid_contributions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  boss_raid_id UUID NOT NULL REFERENCES boss_raids(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  damage_dealt INTEGER NOT NULL DEFAULT 0,
  tasks_completed INTEGER NOT NULL DEFAULT 0,
  focus_minutes INTEGER NOT NULL DEFAULT 0,
  last_contribution_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(boss_raid_id, user_id)
);

-- 3. Boss Raid History (Completed raids archive)
CREATE TABLE IF NOT EXISTS boss_raid_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  boss_raid_id UUID NOT NULL REFERENCES boss_raids(id),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  damage_dealt INTEGER NOT NULL,
  reward_claimed BOOLEAN DEFAULT FALSE,
  rank INTEGER, -- Player's rank by damage dealt
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_boss_raids_week ON boss_raids(week_start, week_end);
CREATE INDEX IF NOT EXISTS idx_boss_raids_status ON boss_raids(status);
CREATE INDEX IF NOT EXISTS idx_boss_contributions_boss ON boss_raid_contributions(boss_raid_id);
CREATE INDEX IF NOT EXISTS idx_boss_contributions_user ON boss_raid_contributions(user_id);
CREATE INDEX IF NOT EXISTS idx_boss_history_user ON boss_raid_history(user_id);

-- Enable Row Level Security
ALTER TABLE boss_raids ENABLE ROW LEVEL SECURITY;
ALTER TABLE boss_raid_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE boss_raid_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for boss_raids (everyone can read, no one can write directly)
CREATE POLICY "Anyone can view active boss raids"
  ON boss_raids FOR SELECT
  USING (true);

-- RLS Policies for boss_raid_contributions (users can view all, update own)
CREATE POLICY "Anyone can view boss contributions"
  ON boss_raid_contributions FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own contributions"
  ON boss_raid_contributions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own contributions"
  ON boss_raid_contributions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for boss_raid_history (users can view all, own can be updated)
CREATE POLICY "Anyone can view boss raid history"
  ON boss_raid_history FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own history"
  ON boss_raid_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own history"
  ON boss_raid_history FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_boss_raid_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-updating timestamp
CREATE TRIGGER update_boss_raid_timestamp_trigger
  BEFORE UPDATE ON boss_raids
  FOR EACH ROW
  EXECUTE FUNCTION update_boss_raid_timestamp();

-- Function to deal damage to boss (called from backend)
CREATE OR REPLACE FUNCTION deal_boss_damage(
  p_boss_raid_id UUID,
  p_user_id UUID,
  p_damage INTEGER,
  p_task_increment INTEGER DEFAULT 0,
  p_focus_minutes INTEGER DEFAULT 0
)
RETURNS JSON AS $$
DECLARE
  v_boss boss_raids%ROWTYPE;
  v_new_hp INTEGER;
  v_defeated BOOLEAN := FALSE;
BEGIN
  -- Get current boss
  SELECT * INTO v_boss FROM boss_raids WHERE id = p_boss_raid_id AND status = 'active';
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Boss not found or not active');
  END IF;

  -- Calculate new HP (can't go below 0)
  v_new_hp := GREATEST(v_boss.current_hp - p_damage, 0);
  
  -- Check if defeated
  IF v_new_hp = 0 THEN
    v_defeated := TRUE;
  END IF;

  -- Update boss HP
  UPDATE boss_raids 
  SET current_hp = v_new_hp,
      status = CASE WHEN v_defeated THEN 'defeated' ELSE 'active' END,
      updated_at = NOW()
  WHERE id = p_boss_raid_id;

  -- Upsert player contribution
  INSERT INTO boss_raid_contributions (boss_raid_id, user_id, damage_dealt, tasks_completed, focus_minutes, last_contribution_at)
  VALUES (p_boss_raid_id, p_user_id, p_damage, p_task_increment, p_focus_minutes, NOW())
  ON CONFLICT (boss_raid_id, user_id)
  DO UPDATE SET
    damage_dealt = boss_raid_contributions.damage_dealt + p_damage,
    tasks_completed = boss_raid_contributions.tasks_completed + p_task_increment,
    focus_minutes = boss_raid_contributions.focus_minutes + p_focus_minutes,
    last_contribution_at = NOW();

  RETURN json_build_object(
    'success', true,
    'new_hp', v_new_hp,
    'defeated', v_defeated,
    'damage_dealt', p_damage
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert initial boss raid for current week (run this manually to start first boss)
-- Adjust dates and HP as needed
/*
INSERT INTO boss_raids (name, description, total_hp, current_hp, week_start, week_end, reward_xp, reward_credits, reward_tickets)
VALUES (
  'Hidra das Distrações',
  'Um monstro de sete cabeças que representa todas as distrações que te impedem de focar. Cada cabeça regenera se você parar de atacar!',
  50000,
  50000,
  DATE_TRUNC('week', NOW() + INTERVAL '1 day'), -- Monday of current week
  DATE_TRUNC('week', NOW() + INTERVAL '1 day') + INTERVAL '6 days 23 hours 59 minutes', -- Sunday
  200,
  100,
  2
);
*/
