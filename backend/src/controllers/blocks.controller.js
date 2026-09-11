const Block = require('../models/Block');
const Conflict = require('../models/Conflict');
const BlockPlanning = require('../models/BlockPlanning');

// In-memory fallback cache to ensure zero latency and fallback resilience
let inMemoryBlocks = [];

const DEPT_COLOR_MAP = {
  Civil: 'gold',
  Electrical: 'terracotta',
  Signal: 'teal',
  'Signal & Telecom': 'purple',
  Telecom: 'purple',
  Mechanical: 'gray',
  Operations: 'teal',
};

function generateDefaultCalendarBlocks() {
  const today = new Date();
  const getDate = (offset) => {
    const d = new Date(today);
    d.setDate(d.getDate() + offset);
    return d.toISOString().split('T')[0];
  };

  return [
    {
      id: 'SLOT-2026-001',
      slotId: 'SLOT-2026-001',
      title: 'Track Renewal & Tamping',
      department: 'Civil',
      startTime: '09:00',
      endTime: '12:00',
      startHour: 9.0,
      duration: '3 hours',
      durationMinutes: 180,
      durationHours: 3.0,
      status: 'Occupied',
      bookedBy: 'Rajesh Verma (SSE/P-Way)',
      inCharge: 'Rajesh Verma (SSE/P-Way)',
      date: getDate(0),
      dateLabel: String(new Date(getDate(0)).getDate()),
      dayIndex: new Date(getDate(0)).getDay(),
      day: 'mon',
      section: 'NDLS - AGC Quadruple Corridor',
      track: 'Up Slow Line',
      colorKey: 'gold',
      deptTag: 'Civil Dept',
      description: 'Heavy ballast cleaning and track tamping at km 47.5 to 49.2',
      isClickable: false,
      adminCreated: true,
    },
    {
      id: 'SLOT-2026-002',
      slotId: 'SLOT-2026-002',
      title: 'OHE Maintenance & Insulator Wash',
      department: 'Electrical',
      startTime: '14:00',
      endTime: '17:00',
      startHour: 14.0,
      duration: '3 hours',
      durationMinutes: 180,
      durationHours: 3.0,
      status: 'Occupied',
      bookedBy: 'Sunil Mehta (DEE/TRD)',
      inCharge: 'Sunil Mehta (DEE/TRD)',
      date: getDate(1),
      dateLabel: String(new Date(getDate(1)).getDate()),
      dayIndex: new Date(getDate(1)).getDay(),
      day: 'tue',
      section: 'Faridabad - Tuglakabad',
      track: 'Main Line',
      colorKey: 'terracotta',
      deptTag: 'Electrical Dept',
      description: '25kV OHE insulator washing and cantilever alignment check',
      isClickable: false,
      adminCreated: true,
    },
    {
      id: 'SLOT-2026-003',
      slotId: 'SLOT-2026-003',
      title: 'Signal & Interlocking Maintenance',
      department: 'Signal',
      startTime: '10:00',
      endTime: '13:00',
      startHour: 10.0,
      duration: '3 hours',
      durationMinutes: 180,
      durationHours: 3.0,
      status: 'Occupied',
      bookedBy: 'Anand Sharma (SE/Signal)',
      inCharge: 'Anand Sharma (SE/Signal)',
      date: getDate(2),
      dateLabel: String(new Date(getDate(2)).getDate()),
      dayIndex: new Date(getDate(2)).getDay(),
      day: 'wed',
      section: 'Palwal - Ballabgarh',
      track: 'Down Main Line',
      colorKey: 'teal',
      deptTag: 'Signal Dept',
      description: 'Electronic interlocking system test and axle counter reset',
      isClickable: false,
      adminCreated: true,
    },
    {
      id: 'SLOT-2026-004',
      slotId: 'SLOT-2026-004',
      title: 'Available Maintenance Slot',
      department: null,
      startTime: '08:00',
      endTime: '10:00',
      startHour: 8.0,
      duration: '2 hours',
      durationMinutes: 120,
      durationHours: 2.0,
      status: 'Available',
      bookedBy: null,
      inCharge: null,
      date: getDate(3),
      dateLabel: String(new Date(getDate(3)).getDate()),
      dayIndex: new Date(getDate(3)).getDay(),
      day: 'thu',
      section: 'NDLS - MTJ Outer Yard',
      track: 'Up Slow Line',
      colorKey: 'white',
      deptTag: 'Available',
      description: 'Open for Junior Engineer booking',
      isClickable: true,
      adminCreated: true,
    },
    {
      id: 'SLOT-2026-005',
      slotId: 'SLOT-2026-005',
      title: 'Telecom Fiber Optic Cable Laying',
      department: 'Signal & Telecom',
      startTime: '11:00',
      endTime: '14:00',
      startHour: 11.0,
      duration: '3 hours',
      durationMinutes: 180,
      durationHours: 3.0,
      status: 'Occupied',
      bookedBy: 'Pradeep Kumar (JE/Telecom)',
      inCharge: 'Pradeep Kumar (JE/Telecom)',
      date: getDate(4),
      dateLabel: String(new Date(getDate(4)).getDate()),
      dayIndex: new Date(getDate(4)).getDay(),
      day: 'fri',
      section: 'Ghaziabad Junction Yard',
      track: 'Loop Line 2',
      colorKey: 'purple',
      deptTag: 'Telecom Dept',
      description: 'OFC jointing and OTDR signal loss measurement testing',
      isClickable: false,
      adminCreated: true,
    },
    {
      id: 'SLOT-2026-006',
      slotId: 'SLOT-2026-006',
      title: 'Available Maintenance Slot',
      department: null,
      startTime: '15:00',
      endTime: '18:00',
      startHour: 15.0,
      duration: '3 hours',
      durationMinutes: 180,
      durationHours: 3.0,
      status: 'Available',
      bookedBy: null,
      inCharge: null,
      date: getDate(5),
      dateLabel: String(new Date(getDate(5)).getDate()),
      dayIndex: new Date(getDate(5)).getDay(),
      day: 'sat',
      section: 'Agra Cantt - Mathura Junction',
      track: 'Main Line',
      colorKey: 'white',
      deptTag: 'Available',
      description: 'Pre-cleared 3-hour possession window open for claims',
      isClickable: true,
      adminCreated: true,
    },
    {
      id: 'SLOT-2026-007',
      slotId: 'SLOT-2026-007',
      title: 'Ultrasonic Rail Flaw Detection (USFD)',
      department: 'Civil',
      startTime: '07:00',
      endTime: '10:00',
      startHour: 7.0,
      duration: '3 hours',
      durationMinutes: 180,
      durationHours: 3.0,
      status: 'Occupied',
      bookedBy: 'Amit Singh (SSE/P-Way)',
      inCharge: 'Amit Singh (SSE/P-Way)',
      date: getDate(6),
      dateLabel: String(new Date(getDate(6)).getDate()),
      dayIndex: new Date(getDate(6)).getDay(),
      day: 'sun',
      section: 'Kota Junction Yard',
      track: 'Main Line',
      colorKey: 'gold',
      deptTag: 'Civil Dept',
      description: 'Periodic ultrasonic testing of rail head and weld joints',
      isClickable: false,
      adminCreated: true,
    },
  ];
}

if (inMemoryBlocks.length === 0) {
  inMemoryBlocks = generateDefaultCalendarBlocks();
}

/**
 * Normalizes a block object to ensure all frontend fields exist
 */
function normalizeBlock(b) {
  const raw = b.toJSON ? b.toJSON() : b;
  const slotId = raw.slotId || raw.id;
  return {
    ...raw,
    id: raw.id || slotId,
    slotId: slotId,
    colorKey: raw.colorKey || DEPT_COLOR_MAP[raw.department] || (raw.status === 'Available' ? 'white' : 'gray'),
    deptTag: raw.deptTag || (raw.department ? `${raw.department} Dept` : 'Available'),
    durationMinutes: raw.durationMinutes || (raw.durationHours ? Math.round(raw.durationHours * 60) : 60),
    isClickable: raw.isClickable !== undefined ? raw.isClickable : raw.status === 'Available',
  };
}

/**
 * GET /api/blocks — Fetch all maintenance blocks
 * Supports query params: department, status, day
 */
const getAllBlocks = async (req, res) => {
  try {
    const { department, status, day } = req.query;
    let blocks = [];
    let dataSource = 'supabase-postgres';

    try {
      const where = {};
      if (department && department !== 'All Departments') where.department = department;
      if (status && status !== 'All Statuses') where.status = status;
      if (day && day !== 'all') where.day = day;

      const dbBlocks = await Block.findAll({
        where,
        order: [
          ['date', 'ASC'],
          ['start_hour', 'ASC'],
        ],
      });

      if (dbBlocks && dbBlocks.length > 0) {
        blocks = dbBlocks.map(normalizeBlock);
        inMemoryBlocks = blocks;
      } else {
        blocks = inMemoryBlocks;
        dataSource = 'memory';
      }
    } catch (pgErr) {
      console.warn('[Blocks PG Warning]:', pgErr.message);
      blocks = inMemoryBlocks;
      dataSource = 'memory';
    }

    res.status(200).json({
      success: true,
      count: blocks.length,
      dataSource,
      data: blocks,
    });
  } catch (error) {
    console.error('[Get Blocks Error]:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch blocks' });
  }
};

/**
 * PUT /api/blocks/book/:id — Junior Engineer books an available slot
 */
const bookBlock = async (req, res, io) => {
  try {
    const { id } = req.params;
    const { name, department, description } = req.body;

    if (!name || !department) {
      return res.status(400).json({ success: false, message: 'Engineer name and department are required' });
    }

    const colorKey = DEPT_COLOR_MAP[department] || 'terracotta';
    const deptTag = `${department} Dept`;
    const formattedTitle = description && description.trim()
      ? `${department} Maintenance: ${description.trim()}`
      : `${department} Maintenance Work`;

    const updateFields = {
      title: formattedTitle,
      status: 'Occupied',
      bookedBy: name.trim(),
      inCharge: name.trim(),
      department,
      colorKey,
      deptTag,
      description: description ? description.trim() : `Booked by ${name} (${department})`,
      isClickable: false,
    };

    let updatedBlock = null;

    try {
      const existing = await Block.findOne({
        where: {
          [require('sequelize').Op.or]: [{ id }, { slotId: id }],
        },
      });

      if (existing) {
        await existing.update(updateFields);
        await existing.reload();
        updatedBlock = normalizeBlock(existing);
        console.log(`[Supabase PostgreSQL] Persisted booked block ${id} for ${name} (${department})`);
      } else {
        const memBlock = inMemoryBlocks.find((b) => b.slotId === id || b.id === id);
        const toCreate = {
          ...(memBlock || {}),
          id,
          slotId: id,
          ...updateFields,
        };
        const created = await Block.create(toCreate);
        updatedBlock = normalizeBlock(created);
        console.log(`[Supabase PostgreSQL] Created & saved new booked block ${id} for ${name}`);
      }
    } catch (pgErr) {
      console.warn('[Book Block PG Warning]:', pgErr.message);
    }

    // Update in-memory fallback
    const memIdx = inMemoryBlocks.findIndex((b) => b.slotId === id || b.id === id);
    if (memIdx !== -1) {
      inMemoryBlocks[memIdx] = { ...inMemoryBlocks[memIdx], ...updateFields };
      if (!updatedBlock) updatedBlock = inMemoryBlocks[memIdx];
    } else if (updatedBlock) {
      inMemoryBlocks.push(updatedBlock);
    }

    if (!updatedBlock) {
      return res.status(404).json({ success: false, message: `Block '${id}' not found` });
    }

    // Sync to dedicated block_planning table in Supabase PostgreSQL
    try {
      const slotKey = updatedBlock.slotId || updatedBlock.id;
      let officerId = null;
      const lowerName = name.toLowerCase();
      if (lowerName.includes('gurpreet')) officerId = 'TRD002';
      else if (lowerName.includes('ramesh')) officerId = 'ENG001';
      else if (lowerName.includes('anand')) officerId = 'SNT001';
      else if (lowerName.includes('sunil')) officerId = 'TRD001';

      await BlockPlanning.destroy({ where: { slotId: slotKey } });
      await BlockPlanning.create({
        slotId: slotKey,
        officerId,
        officerName: name.trim(),
        department,
        designation: `Junior Engineer (${department})`,
        workTitle: formattedTitle,
        workDescription: description ? description.trim() : null,
        section: updatedBlock.section || 'General Section',
        track: updatedBlock.track || 'Main Line',
        scheduledDate: updatedBlock.date || new Date().toISOString().split('T')[0],
        startTime: updatedBlock.startTime || '08:00',
        endTime: updatedBlock.endTime || '10:00',
        duration: updatedBlock.duration || '2 hours',
        durationMinutes: updatedBlock.durationMinutes || 120,
        status: 'Occupied',
        bookingChannel: 'Teams Calendar Web Portal',
      });
      console.log(`[Supabase PostgreSQL] Synced booking ${slotKey} to dedicated block_planning table for ${name}`);
    } catch (bpErr) {
      console.warn('[BlockPlanning Table Sync Warning]:', bpErr.message);
    }

    // Broadcast real-time Socket.io events
    if (io) {
      io.emit('blockUpdated', updatedBlock);
      io.emit('block:booked', updatedBlock);
      io.emit('block:updated', updatedBlock);
    }

    res.status(200).json({
      success: true,
      message: `Block booked by ${name}`,
      data: updatedBlock,
    });
  } catch (error) {
    console.error('[Book Block Error]:', error);
    res.status(500).json({ success: false, message: error.message || 'Booking failed' });
  }
};

/**
 * POST /api/blocks/available — Admin designates a new available slot
 */
const createAvailableSlot = async (req, res, io) => {
  try {
    const { duration, date, section, track, startTime } = req.body;

    if (!duration || !date || !startTime) {
      return res.status(400).json({ success: false, message: 'Duration, date, and start time are required' });
    }

    const durationMap = {
      '30 mins': { minutes: 30, hours: 0.5 },
      '1 hour': { minutes: 60, hours: 1.0 },
      '2 hours': { minutes: 120, hours: 2.0 },
      '3 hours': { minutes: 180, hours: 3.0 },
    };
    const dur = durationMap[duration] || { minutes: 60, hours: 1.0 };

    const [h, m] = startTime.split(':').map(Number);
    const endMins = (h || 0) * 60 + (m || 0) + dur.minutes;
    const endTime = `${String(Math.floor(endMins / 60) % 24).padStart(2, '0')}:${String(endMins % 60).padStart(2, '0')}`;

    const d = new Date(date + 'T12:00:00');
    const slotId = `SLOT-${Date.now()}`;
    const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

    const newBlockData = {
      id: slotId,
      slotId,
      title: 'Available Maintenance Slot',
      department: null,
      startTime,
      endTime,
      startHour: (h || 0) + (m || 0) / 60,
      duration,
      durationMinutes: dur.minutes,
      durationHours: dur.hours,
      status: 'Available',
      bookedBy: null,
      inCharge: null,
      date,
      dateLabel: String(d.getDate()),
      dayIndex: d.getDay(),
      day: dayNames[d.getDay()] || 'mon',
      section: section || 'General Corridor Section',
      track: track || 'Main Line',
      colorKey: 'white',
      deptTag: 'Available',
      description: 'Open for Junior Engineer booking',
      isClickable: true,
      adminCreated: true,
    };

    let savedBlock = newBlockData;

    try {
      const created = await Block.create(newBlockData);
      savedBlock = normalizeBlock(created);
    } catch (pgErr) {
      console.warn('[Create Block PG Warning]:', pgErr.message);
    }

    inMemoryBlocks.push(savedBlock);

    // Broadcast real-time Socket.io event
    if (io) {
      io.emit('block:created', savedBlock);
      io.emit('blockUpdated', savedBlock);
    }

    res.status(201).json({
      success: true,
      message: 'Available slot created',
      data: savedBlock,
    });
  } catch (error) {
    console.error('[Create Slot Error]:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to create slot' });
  }
};

/**
 * DELETE /api/blocks/:slotId — Admin-only deletion
 */
const deleteBlock = async (req, res, io) => {
  try {
    const { slotId } = req.params;

    // Authorization check
    const userRole = req.headers['x-user-role'] || req.headers['role'] || req.query.role;
    if (userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: Only administrators have rights to delete maintenance blocks.',
      });
    }

    let deletedBlock = null;

    try {
      const existing = await Block.findOne({
        where: {
          [require('sequelize').Op.or]: [{ id: slotId }, { slotId }],
        },
      });

      if (existing) {
        deletedBlock = normalizeBlock(existing);
        await existing.destroy();
      }
    } catch (pgErr) {
      console.warn('[Delete Block PG Warning]:', pgErr.message);
    }

    const memIdx = inMemoryBlocks.findIndex((b) => b.slotId === slotId || b.id === slotId);
    if (memIdx !== -1) {
      if (!deletedBlock) deletedBlock = inMemoryBlocks[memIdx];
      inMemoryBlocks.splice(memIdx, 1);
    }

    if (!deletedBlock) {
      return res.status(404).json({ success: false, message: `Block '${slotId}' not found` });
    }

    // Broadcast real-time Socket.io events
    if (io) {
      io.emit('block:deleted', { slotId });
      io.emit('blockDeleted', { slotId });
    }

    res.status(200).json({
      success: true,
      message: 'Block deleted by administrator',
      data: deletedBlock,
    });
  } catch (error) {
    console.error('[Delete Block Error]:', error);
    res.status(500).json({ success: false, message: error.message || 'Delete failed' });
  }
};

/**
 * POST /api/blocks/reset — Clear and re-seed standard schedule
 */
const resetSchedule = async (req, res, io) => {
  try {
    const seedData = generateDefaultCalendarBlocks();
    inMemoryBlocks = seedData;

    try {
      for (const b of seedData) {
        await Block.upsert(b);
      }
      // Re-activate conf-1
      await Conflict.update({ isResolved: false }, { where: { id: 'conf-1' } });
    } catch (pgErr) {
      console.warn('[Reset Schedule PG Warning]:', pgErr.message);
    }

    if (io) io.emit('timeline:reset', inMemoryBlocks);

    res.status(200).json({
      success: true,
      message: 'Schedule reset to baseline',
      count: inMemoryBlocks.length,
      data: inMemoryBlocks,
    });
  } catch (error) {
    console.error('[Reset Error]:', error);
    res.status(500).json({ success: false, message: error.message || 'Reset failed' });
  }
};

/**
 * GET /api/blocks/conflicts — Returns active schedule conflicts
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
    console.error('[Conflict Error]:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * POST /api/blocks/optimize — AI slot shifting to eliminate freight bottleneck
 */
const optimizeSchedule = async (req, res, io) => {
  try {
    const { conflictId } = req.body;
    const targetConflictId = conflictId || 'conf-1';

    const conflict = await Conflict.findByPk(targetConflictId);
    if (!conflict) {
      return res.status(404).json({ success: false, message: 'Conflict not found' });
    }

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

    await conflict.update({ isResolved: true });

    const updatedBlocks = await Block.findAll({ order: [['start_hour', 'ASC']] });
    const normalized = updatedBlocks.map(normalizeBlock);

    if (io) {
      io.emit('timeline:reset', normalized);
    }

    res.json({
      success: true,
      message: 'AI Optimization applied: Maintenance block window shifted safely.',
      updatedBlocks: normalized,
    });
  } catch (err) {
    console.error('[Optimization Error]:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * GET /api/block-planning — Returns dedicated block planning table entries with officer relations
 */
const getBlockPlanning = async (req, res) => {
  try {
    const plans = await BlockPlanning.findAll({
      order: [['scheduled_date', 'ASC'], ['start_time', 'ASC']],
      include: [
        { association: 'officer', attributes: ['userId', 'name', 'designation', 'department'], required: false },
        { association: 'slot', attributes: ['title', 'section', 'track', 'status', 'colorKey'], required: false },
      ],
    });
    res.json({
      success: true,
      count: plans.length,
      data: plans,
    });
  } catch (err) {
    console.error('[Get Block Planning Error]:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  getAllBlocks,
  bookBlock,
  createAvailableSlot,
  deleteBlock,
  resetSchedule,
  getConflicts,
  optimizeSchedule,
  getBlockPlanning,
};
