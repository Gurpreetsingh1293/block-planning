const Block = require('../models/Block');
const Conflict = require('../models/Conflict');

/**
 * GET /api/blocks
 * Returns maintenance blocks matching department, status, and day filters
 */
const getBlocks = async (req, res) => {
  try {
    const { department, status, day } = req.query;
    const where = {};

    if (department && department !== 'All Departments') {
      where.department = department;
    }
    if (status && status !== 'All Statuses') {
      where.status = status;
    }
    if (day && day !== 'all') {
      where.day = day;
    }

    const blocks = await Block.findAll({
      where,
      order: [['start_hour', 'ASC']],
    });

    res.json({
      success: true,
      count: blocks.length,
      data: blocks,
    });
  } catch (err) {
    console.error('[Block Controller Error]:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * GET /api/blocks/conflicts
 * Returns active schedule conflicts
 */
const getConflicts = async (req, res) => {
  try {
    const conflicts = await Conflict.findAll({
      where: { isResolved: false },
    });
    res.json({
      success: true,
      count: conflicts.length,
      data: conflicts,
    });
  } catch (err) {
    console.error('[Conflict Controller Error]:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * POST /api/blocks/optimize
 * Applies AI slot shifting to eliminate freight bottlenecks
 */
const applyOptimization = async (req, res) => {
  try {
    const { conflictId } = req.body;
    const targetConflictId = conflictId || 'conf-1';

    const conflict = await Conflict.findByPk(targetConflictId);
    if (!conflict) {
      return res.status(404).json({ success: false, message: 'Conflict not found' });
    }

    // Shift affected block to recommended window
    if (conflict.affectedBlockId) {
      await Block.update(
        {
          startTime: '13:00',
          endTime: '15:00',
          startHour: 13.0,
          durationHours: 2.0,
          status: 'Approved',
          isOptimized: true,
          optimizationNote: 'Shifted to 13:00–15:00 to eliminate freight conflict',
        },
        { where: { id: conflict.affectedBlockId } }
      );
    }

    // Mark conflict as resolved
    await conflict.update({ isResolved: true });

    const updatedBlocks = await Block.findAll({ order: [['start_hour', 'ASC']] });

    res.json({
      success: true,
      message: 'AI Optimization applied: Maintenance block window shifted safely.',
      updatedBlocks,
    });
  } catch (err) {
    console.error('[Optimization Error]:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * POST /api/blocks/reset
 * Resets blocks and conflicts to original baseline
 */
const resetBlocks = async (req, res) => {
  try {
    // Reset block-trd-1 back to original slot
    await Block.update(
      {
        startTime: '10:00',
        endTime: '12:00',
        startHour: 10.0,
        durationHours: 2.0,
        status: 'Under Review',
        isOptimized: false,
        optimizationNote: null,
      },
      { where: { id: 'block-trd-1' } }
    );

    // Re-activate conf-1
    await Conflict.update({ isResolved: false }, { where: { id: 'conf-1' } });

    const blocks = await Block.findAll({ order: [['start_hour', 'ASC']] });

    res.json({
      success: true,
      message: 'Schedule reset to baseline.',
      data: blocks,
    });
  } catch (err) {
    console.error('[Reset Error]:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  getBlocks,
  getConflicts,
  applyOptimization,
  resetBlocks,
};
