require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;

if (supabaseUrl && supabaseKey && !supabaseUrl.includes('your-project-ref')) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('[Supabase Client] Initialized successfully with project URL:', supabaseUrl);
  } catch (error) {
    console.warn('[Supabase Warning] Failed to initialize Supabase client:', error.message);
  }
}

module.exports = supabase;
