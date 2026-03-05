import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://wgjibleylpjvbxfjuknj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndnamlibGV5bHBqdmJ4Zmp1a25qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2NjI3NjUsImV4cCI6MjA4ODIzODc2NX0.0-gXotTvQHMFpCmOwW9Spj_EdPSOj1CUrXZtYnUhrQ0";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
