import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// For production, move these to environment variables (.env file)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// TypeScript types for database
export interface ContactFormSubmission {
  id?: string;
  created_at?: string;
  name: string;
  email: string;
  project_type: string;
  message: string;
}
