const express = require('express');
const router = express.Router();

const healthRoutes = require('./health.routes');
const Section = require('../models/Section');
const TrainSchedule = require('../models/TrainSchedule');
const MaintenanceRequest = require('../models/MaintenanceRequest');
const GoodsForecast = require('../models/GoodsForecast');
const BlockPlan = require('../models/BlockPlan');
const { predictBlockRisk } = require('../services/ml.service');

// Health Check
router.use('/health', healthRoutes);

// Sections Endpoints
router.get('/sections', async (req, res) => {
  try {
    const sections = await Section.find({ isActive: true }).sort({ sectionCode: 1 });
    res.json({ success: true, count: sections.length, data: sections });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Train Schedules Endpoints
router.get('/train-schedules', async (req, res) => {
  try {
    const { section } = req.query;
    const filter = section ? { traversedSections: section } : {};
    const schedules = await TrainSchedule.find(filter).sort({ priority: 1 });
    res.json({ success: true, count: schedules.length, data: schedules });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Maintenance Requests Endpoints
router.get('/maintenance-requests', async (req, res) => {
  try {
    const requests = await MaintenanceRequest.find().sort({ proposedDate: 1 });
    res.json({ success: true, count: requests.length, data: requests });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/maintenance-requests', async (req, res) => {
  try {
    const newRequest = new MaintenanceRequest(req.body);
    const saved = await newRequest.save();
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Goods Forecasts Endpoints
router.get('/goods-forecasts', async (req, res) => {
  try {
    const forecasts = await GoodsForecast.find().sort({ date: 1 });
    res.json({ success: true, count: forecasts.length, data: forecasts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Block Plans Endpoints
router.get('/block-plans', async (req, res) => {
  try {
    const plans = await BlockPlan.find().sort({ planDate: -1 });
    res.json({ success: true, count: plans.length, data: plans });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// AI & ML Block Plan Risk Evaluation
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
