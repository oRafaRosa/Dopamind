-- Dopamind Roulette Ticket System Migration
-- Execute this SQL in your Supabase SQL Editor

-- 1. Add roulette_tickets column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS roulette_tickets INTEGER DEFAULT 3;

-- 2. Add last_login_date for daily bonus tracking
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS last_login_date DATE;

-- 3. Create roulette_history table
CREATE TABLE IF NOT EXISTS roulette_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_text TEXT NOT NULL,
  challenge_type TEXT NOT NULL,
  xp_reward INTEGER NOT NULL,
  tickets_won INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_roulette_history_user_id ON roulette_history(user_id);
CREATE INDEX IF NOT EXISTS idx_roulette_history_created_at ON roulette_history(created_at DESC);

-- 5. Add grants_ticket column to tasks table
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS grants_ticket BOOLEAN DEFAULT FALSE;

-- 6. Update existing users to have 3 starting tickets (optional, run if needed)
-- UPDATE profiles SET roulette_tickets = 3 WHERE roulette_tickets IS NULL;

-- 7. Enable Row Level Security (RLS) for roulette_history
ALTER TABLE roulette_history ENABLE ROW LEVEL SECURITY;

-- 8. Create RLS policies for roulette_history
CREATE POLICY "Users can view their own roulette history"
  ON roulette_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own roulette history"
  ON roulette_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Migration complete!
-- Verify with: SELECT roulette_tickets FROM profiles WHERE id = auth.uid();
