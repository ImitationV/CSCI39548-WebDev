import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://rgijadygyvjjeeobybep.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnaWphZHlneXZqamVlb2J5YmVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNjA5MTQsImV4cCI6MjA2MjczNjkxNH0.PA1RebVzzEm_oDpSkZEW0iokKs_Y302pwI4NczATqYk';
export const supabase = createClient(supabaseUrl, supabaseAnonKey);


