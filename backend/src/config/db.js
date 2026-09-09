const { sequelize } = require('./postgres');
const supabase = require('./supabase');

let isConnected = false;

/**
 * Connects to PostgreSQL / Supabase with clean diagnostics
 */
const connectDB = async () => {
  const dbUrl = process.env.DATABASE_URL || '';
  const isCloudSupabase = dbUrl.includes('supabase.co') || dbUrl.includes('pooler.supabase.com');

  if (!isCloudSupabase && !process.env.SUPABASE_URL) {
    console.log('[Database] Running with Railway Demo accounts (ENG001, SNT001, TRD001).');
    console.log('[Database Tip] Paste your Supabase URL & keys in backend/.env to connect cloud database.');
    return;
  }

  try {
    if (sequelize) {
      await sequelize.authenticate();
      isConnected = true;
      console.log('[PostgreSQL/Supabase] Cloud database connected successfully.');
    }
  } catch (error) {
    console.warn('[PostgreSQL/Supabase Warning] Could not connect to PostgreSQL:', error.message);
    if (supabase) {
      console.log('[Supabase API] Supabase REST Client is active and ready.');
    } else {
      console.log('[Database] Fallback to Railway Officer Registry active for uninterrupted demo.');
    }
  }
};

const getDbStatus = () => {
  const hasSupabase = Boolean(supabase);
  return {
    isConnected: isConnected || hasSupabase,
    status: isConnected ? 'connected' : hasSupabase ? 'connected (supabase-api)' : 'standby',
    type: 'PostgreSQL / Supabase',
  };
};

module.exports = connectDB;
module.exports.getDbStatus = getDbStatus;
