const Corridor = require('../models/Corridor');
const Metric = require('../models/Metric');
const Train = require('../models/Train');

/**
 * GET /api/tracking/corridors
 * Returns railway corridor geometry, schematic nodes, and track lines
 */
const getCorridors = async (req, res) => {
  try {
    const corridors = await Corridor.findAll();
    res.json({
      success: true,
      count: corridors.length,
      data: corridors,
    });
  } catch (err) {
    console.error('[Tracking Controller Error]:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * GET /api/tracking/metrics
 * Returns live network telemetry KPIs
 */
const getMetrics = async (req, res) => {
  try {
    const metric = await Metric.findOne({
      order: [['recorded_at', 'DESC']],
    });

    res.json({
      success: true,
      data: metric || {
        totalMonitored: 124,
        onTime: 118,
        delayed: 6,
        corridorsActive: 5,
        freightInTransit: 38,
        passengerInTransit: 86,
        averageNetworkSpeed: '94.2 km/h',
        criticalAlerts: 1,
      },
    });
  } catch (err) {
    console.error('[Metrics Controller Error]:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * GET /api/tracking/trains
 * Returns real-time train rakes filtered by viewType
 */
const getLiveMovement = async (req, res) => {
  try {
    const { viewType } = req.query;
    const where = {};

    if (viewType === 'PASSENGER') {
      where.type = 'PASSENGER';
    } else if (viewType === 'CARGO') {
      where.type = 'CARGO';
    }

    const trains = await Train.findAll({
      where,
      order: [['priority', 'ASC'], ['number', 'ASC']],
    });

    res.json({
      success: true,
      count: trains.length,
      data: trains,
    });
  } catch (err) {
    console.error('[Train Movement Error]:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * GET /api/tracking/trains/:id
 * Returns a specific train by id or number
 */
const getTrainById = async (req, res) => {
  try {
    const { id } = req.params;
    const train = await Train.findOne({
      where: {
        [require('sequelize').Op.or]: [{ id }, { number: id }],
      },
    });

    if (!train) {
      return res.status(404).json({ success: false, message: 'Train not found' });
    }

    res.json({
      success: true,
      data: train,
    });
  } catch (err) {
    console.error('[Get Train Error]:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  getCorridors,
  getMetrics,
  getLiveMovement,
  getTrainById,
};
