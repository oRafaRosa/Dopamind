import { createClient } from '@supabase/supabase-js';

// Use import.meta.env for Vite compatibility. 
// Fallback to empty strings to prevent crashing if not set.
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

// Create client only if keys are present, otherwise create a dummy client to avoid initial errors
// In a real scenario, you'd want to handle this more gracefully, but for the UI demo it prevents the crash.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);

export const isSupabaseConfigured = () => {
  return supabaseUrl.length > 0 && supabaseAnonKey.length > 0;
};