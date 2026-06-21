// Central configuration (env vars, API keys etc)
export const config = {
  // Supabase config (replace these with your project values)
  supabase: {
    url: 'https://kruwfhzfqieuiuhqlutt.supabase.co',  // Your Supabase project URL
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtydXdmaHpmcWlldWl1aHFsdXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxOTk0OTAsImV4cCI6MjA3Nzc3NTQ5MH0.XD3-PDjDtKwCVsBILYgVrHF7Yc9tHkzpvpN2b7ojvB4',  // Your public anon key
  },
};

// Make config available globally for scripts that run before modules load
if (typeof window !== 'undefined') {
  window.SUPABASE_URL = config.supabase.url;
  window.SUPABASE_ANON_KEY = config.supabase.anonKey;
}