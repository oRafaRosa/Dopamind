import { createClient } from '@supabase/supabase-js';

// Safe access to environment variables that works in both Vite dev and prod builds
// @ts-ignore
const env = import.meta.env || {};

const supabaseUrl = env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || '';

// Create client only if keys are present, otherwise create a dummy client to avoid initial errors
// Use a placeholder URL that is structurally valid to prevent synchronous throw
const validUrl = supabaseUrl.startsWith('http') ? supabaseUrl : 'https://placeholder.supabase.co';
const validKey = supabaseAnonKey || 'placeholder';

export const supabase = createClient(validUrl, validKey);

export const isSupabaseConfigured = () => {
  return supabaseUrl.length > 0 && supabaseAnonKey.length > 0;
};