-- Power Hour Focus System Migration

-- 1. Create power_sessions table
CREATE TABLE IF NOT EXISTS power_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  duration_minutes INTEGER NOT NULL,
  multiplier DECIMAL(3,1) NOT NULL,
  xp_earned INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Add combo tracking to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS power_hour_combo INTEGER DEFAULT 0;

-- 3. Add indexes
CREATE INDEX IF NOT EXISTS idx_power_sessions_user_id ON power_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_power_sessions_created_at ON power_sessions(created_at DESC);

-- 4. Enable RLS
ALTER TABLE power_sessions ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
CREATE POLICY "Users can view their own power sessions"
  ON power_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own power sessions"
  ON power_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own power sessions"
  ON power_sessions FOR UPDATE
  USING (auth.uid() = user_id);
