import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://isjsydhuqurneswstlyx.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzanN5ZGh1cXVybmVzd3N0bHl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4OTAwMTIsImV4cCI6MjA5NDQ2NjAxMn0.u96bKUU_L4ahDkdjtzIk1kjXUtpGcR1bjbgWTfPPfUs";
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
export {
  supabase as s
};
