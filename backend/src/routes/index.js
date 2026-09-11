const express = require('express');
const router = express.Router();

const healthRoutes = require('./health.routes');
const authRoutes = require('./auth.routes');
const blockRoutes = require('./blocks.routes');
const trackingRoutes = require('./tracking.routes');
const stationRoutes = require('./station.routes');
const stRoutes = require('./st.routes');

const Station = require('../models/Station');
const Train = require('../models/Train');
const Block = require('../models/Block');
const { predictBlockRisk } = require('../services/ml.service');

// 1. Health Check
router.use('/health', healthRoutes);

// 2. Railway Authentication Endpoints
router.use('/auth', authRoutes);

// 3. Coordinated Maintenance Blocks & AI Optimizer
router.use('/blocks', blockRoutes);

// 4. Live Movement Tracking & Corridors
router.use('/tracking', trackingRoutes);

// 5. Stations & Timetables
router.use('/stations', stationRoutes);

// 6. Signal & Telecommunication (S&T) Operations
router.use('/st', stRoutes);

// 7. Backward-compatible / Legacy helper routes (backed by PostgreSQL)
router.get('/sections', async (req, res) => {
  try {
    const stations = await Station.findAll({ order: [['km_position', 'ASC']] });
    res.json({ success: true, count: stations.length, data: stations });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/train-schedules', async (req, res) => {
  try {
    const trains = await Train.findAll({ order: [['priority', 'ASC']] });
    res.json({ success: true, count: trains.length, data: trains });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/maintenance-requests', async (req, res) => {
  try {
    const blocks = await Block.findAll({ order: [['start_hour', 'ASC']] });
    res.json({ success: true, count: blocks.length, data: blocks });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/block-plans', async (req, res) => {
  try {
    const blocks = await Block.findAll({ order: [['start_hour', 'ASC']] });
    res.json({ success: true, count: blocks.length, data: blocks });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/block-planning', async (req, res) => {
  try {
    const BlockPlanning = require('../models/BlockPlanning');
    const plans = await BlockPlanning.findAll({
      order: [['scheduled_date', 'ASC'], ['start_time', 'ASC']],
      include: [
        { association: 'officer', attributes: ['userId', 'name', 'designation', 'department'], required: false },
        { association: 'slot', attributes: ['title', 'section', 'track', 'status', 'colorKey'], required: false },
      ],
    });
    res.json({ success: true, count: plans.length, data: plans });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 8. AI & ML Block Plan Risk Evaluation
router.post('/block-plans/evaluate-risk', async (req, res) => {
  try {
    const { sectionCode, workType, requestedDurationMinutes, scheduledHour } = req.body;
    const riskResult = await predictBlockRisk({
      sectionCode,
      workType,
      requestedDurationMinutes,
      scheduledHour,
    });
    res.json({ success: true, data: riskResult });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
