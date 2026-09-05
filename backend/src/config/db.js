const mongoose = require('mongoose');

/**
 * Connects to MongoDB with reconnection logic and helpful debug logs.
 */
const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/sih-block-planning';

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000, // 5s timeout so the server doesn't hang if Mongo isn't up
    });

    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.warn(`[MongoDB Warning] Could not connect to MongoDB at ${mongoUri}`);
    console.warn(`[MongoDB Warning] Error: ${error.message}`);
    console.warn(`[MongoDB Tip] Ensure your local MongoDB service is running, or set MONGO_URI in backend/.env`);
    // Do not crash server in hackathon dev mode so health checks and mock endpoints still function
  }
};

module.exports = connectDB;
