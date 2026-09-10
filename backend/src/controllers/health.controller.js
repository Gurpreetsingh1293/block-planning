const { getDbStatus } = require('../config/db');

/**
 * Health check controller
 * Checks API server status, system uptime, and PostgreSQL / Supabase connectivity
 */
const getHealth = (req, res) => {
  const dbStatus = getDbStatus ? getDbStatus() : { status: 'standby', isConnected: false };

  const responsePayload = {
    status: 'ok',
    service: 'sih-block-planning-backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      status: dbStatus.status,
      isConnected: dbStatus.isConnected,
      type: dbStatus.type || 'PostgreSQL / Supabase',
    },
    environment: process.env.NODE_ENV || 'development',
  };

  res.status(200).json(responsePayload);
};

module.exports = {
  getHealth,
};
