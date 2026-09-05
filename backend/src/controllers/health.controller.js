const mongoose = require('mongoose');

/**
 * Health check controller
 * Checks API server status, system uptime, and MongoDB connectivity
 */
const getHealth = (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const responsePayload = {
    status: 'ok',
    service: 'sih-block-planning-backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      status: states[dbState] || 'unknown',
      isConnected: dbState === 1,
    },
    environment: process.env.NODE_ENV || 'development',
  };

  res.status(200).json(responsePayload);
};

module.exports = {
  getHealth,
};
