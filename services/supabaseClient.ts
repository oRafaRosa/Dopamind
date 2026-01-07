import { createClient } from '@supabase/supabase-js';

// NOTE: For the purpose of this generated code, we will check if env vars exist.
// If they don't, the app will run in "Demo Mode" with local state where possible.

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = () => {
  return supabaseUrl.length > 0 && supabaseAnonKey.length > 0;
};