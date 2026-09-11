const express = require('express');
const router = express.Router();
const {
  getCorridors,
  getMetrics,
  getLiveMovement,
  getTrainById,
} = require('../controllers/tracking.controller');

// GET /api/tracking/corridors - Schematic track corridors and nodes
router.get('/corridors', getCorridors);

// GET /api/tracking/metrics - Real-time control room metrics
router.get('/metrics', getMetrics);

// GET /api/tracking/trains - Live train movement telemetry
router.get('/trains', getLiveMovement);

// GET /api/tracking/trains/:id - Specific train status and stops
router.get('/trains/:id', getTrainById);

module.exports = router;
