const STTask = require('../models/STTask');
const Station = require('../models/Station');

/**
 * GET /api/st/tasks
 * Returns S&T maintenance tasks with station, status, and taskType filters
 */
const getSTTasks = async (req, res) => {
  try {
    const { station, status, taskType } = req.query;
    const where = {};

    if (station && station !== 'all') {
      where.stationId = station;
    }
    if (status && status !== 'all') {
      where.status = status;
    }
    if (taskType && taskType !== 'all') {
      where.taskType = taskType;
    }

    const tasks = await STTask.findAll({
      where,
      order: [['created_at', 'DESC']],
    });

    res.json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (err) {
    console.error('[ST Task Controller Error]:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * PATCH /api/st/tasks/:id
 * Updates task state (e.g. inProgress, clear, scheduled)
 */
const updateSTTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, workStarted } = req.body;

    const task = await STTask.findByPk(id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const updates = {};
    if (status) updates.status = status;
    if (workStarted) updates.workStarted = workStarted;

    await task.update(updates);

    res.json({
      success: true,
      message: `Task ${id} updated to status '${status}'`,
      data: task,
    });
  } catch (err) {
    console.error('[Update Task Error]:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * GET /api/st/corridor
 * Returns Delhi-Mumbai corridor operational overview
 */
const getSTCorridor = async (req, res) => {
  try {
    const stations = await Station.findAll({ order: [['km_position', 'ASC']] });
    const tasks = await STTask.findAll();

    const statusSummary = [
      { label: 'SIGNAL SYSTEM', value: 'Operational', level: 'ok' },
      { label: 'INTERLOCKING', value: 'Healthy', level: 'ok' },
      { label: 'TRACK CIRCUITS', value: '24 / 26 Clear', level: 'warn' },
      { label: 'POINT MACHINES', value: '12 / 12 Healthy', level: 'ok' },
      { label: 'COMMUNICATION', value: 'Connected', level: 'ok' },
      { label: 'ACTIVE FAULTS', value: String(tasks.filter(t => t.status === 'overdue' || t.status === 'blocked').length), level: 'critical' },
    ];

    res.json({
      success: true,
      corridor: 'DELHI-MUMBAI CORRIDOR (DMC-01 · 1384 Km)',
      systemStatus: 'SYSTEM OPERATIONAL',
      stations,
      statusSummary,
      activeTasksCount: tasks.length,
    });
  } catch (err) {
    console.error('[ST Corridor Error]:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  getSTTasks,
  updateSTTaskStatus,
  getSTCorridor,
};
