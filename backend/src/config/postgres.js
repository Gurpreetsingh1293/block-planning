require('dotenv').config();
const { Sequelize } = require('sequelize');

const databaseUrl =
  process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/sih_block_planning';

const isSupabase = databaseUrl.includes('supabase.co') || databaseUrl.includes('pooler.supabase.com');

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: isSupabase
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : {},
});

module.exports = { sequelize };
