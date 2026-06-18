const SUPABASE_URL = "https://ncmowxrkflzjhyolkzwc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jbW93eHJrZmx6amh5b2xrendjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3MjYzODEsImV4cCI6MjA5NzMwMjM4MX0.nBgNyicx1qjvbBy_dC0vZY3R4ppKw3ExVKn-u-5gx90";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);