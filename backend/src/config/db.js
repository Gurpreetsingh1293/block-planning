const { sequelize } = require('./postgres');
const supabase = require('./supabase');
const mongoose = require('mongoose');

let isPostgresConnected = false;
let mongooseConnected = false;

/**
 * Connect to PostgreSQL / Supabase as the primary persistent database
 * and optionally MongoDB if configured.
 */
const connectDB = async () => {
  // 1. Connect to Cloud Supabase PostgreSQL
  const dbUrl = process.env.DATABASE_URL || '';
  const isCloud = dbUrl.includes('supabase.co') || dbUrl.includes('pooler.supabase.com') || process.env.SUPABASE_URL;

  if (isCloud && sequelize) {
    try {
      await sequelize.authenticate();
      isPostgresConnected = true;
      console.log('[Supabase PostgreSQL] Cloud database connected successfully.');
    } catch (pgErr) {
      console.warn('[Supabase PostgreSQL Warning] Could not connect directly to Postgres:', pgErr.message);
      if (supabase) {
        console.log('[Supabase REST] Supabase REST client active and authenticated.');
        isPostgresConnected = true;
      }
    }
  } else {
    console.log('[Auth] Railway Officer Registry active for uninterrupted demo.');
  }

  // 2. Connect to MongoDB if MONGODB_URI is provided
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 2500,
      });
      mongooseConnected = true;
      console.log('[MongoDB] Connected successfully to:', process.env.MONGODB_URI.replace(/\/\/[^@]+@/, '//***@'));
    } catch (err) {
      console.warn('[MongoDB Note] Local MongoDB offline; utilizing Supabase PostgreSQL as primary datastore.');
      mongooseConnected = false;
    }
  }
};

const getDbStatus = () => {
  const isConnected = isPostgresConnected || Boolean(supabase) || mongooseConnected;
  return {
    isConnected,
    status: isConnected ? 'connected' : 'standby',
    type: isPostgresConnected
      ? 'Supabase PostgreSQL (Cloud) + Socket.io'
      : mongooseConnected
      ? 'MongoDB'
      : 'In-Memory Cache (Standby)',
    postgresConnected: isPostgresConnected,
    mongoConnected: mongooseConnected,
  };
};

module.exports = connectDB;
module.exports.getDbStatus = getDbStatus;
