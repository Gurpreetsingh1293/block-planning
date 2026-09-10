const mongoose = require('mongoose');

let mongooseConnected = false;

/**
 * Connect to MongoDB for Block Planning data (Block.model.js)
 * Falls back gracefully — controllers have in-memory fallback when MongoDB is offline
 */
const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/setu-sutra-blockplanning';

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 4000,
    });
    mongooseConnected = true;
    console.log('[MongoDB] Connected successfully to:', mongoUri.replace(/\/\/[^@]+@/, '//***@'));
  } catch (err) {
    console.warn('[MongoDB] Could not connect:', err.message);
    console.log('[MongoDB] Block API will use in-memory storage as fallback.');
    mongooseConnected = false;
  }

  // Also try legacy Sequelize/Supabase (non-blocking, for backwards compat)
  try {
    const { sequelize } = require('./postgres');
    const supabase = require('./supabase');
    const dbUrl = process.env.DATABASE_URL || '';
    const isCloud = dbUrl.includes('supabase.co') || process.env.SUPABASE_URL;

    if (isCloud && sequelize) {
      await sequelize.authenticate();
      console.log('[PostgreSQL/Supabase] Legacy auth database connected.');
    } else {
      console.log('[Auth] Railway Demo accounts active (ENG001, SNT001, TRD001 / railway@123).');
    }
  } catch (legacyErr) {
    // Silent — legacy auth uses demo accounts
  }
};

const getDbStatus = () => ({
  mongoConnected: mongooseConnected,
  mongoStatus: mongooseConnected ? 'connected' : 'offline (in-memory fallback active)',
  type: 'MongoDB + optional Supabase',
});

module.exports = connectDB;
module.exports.getDbStatus = getDbStatus;
