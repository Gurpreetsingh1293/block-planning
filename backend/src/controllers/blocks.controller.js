const mongoose = require('mongoose');
const Block = require('../models/Block.model');

// In-memory fallback storage if MongoDB is not running
let inMemoryBlocks = [];

/**
 * Check if Mongoose is connected — use this to skip buffering timeout
 */
const isMongoReady = () => mongoose.connection.readyState === 1;

/**
 * Department color mapping for block cards
 */
const DEPT_COLOR_MAP = {
  Civil: 'gold',
  Engineering: 'gold',
  Electrical: 'terracotta',
  'Traction/OHE': 'terracotta',
  Signal: 'teal',
  'Signal & Telecom': 'purple',
  'Signal & Telecommunication': 'purple',
  Telecom: 'purple',
  Mechanical: 'gray',
  Operations: 'teal',
};

const normalizeDepartment = (dept) => {
  if (!dept) return null;
  const d = String(dept).trim();
  if (d === 'Engineering') return 'Civil';
  if (d === 'Signal & Telecommunication' || d === 'Telecom') return 'Signal & Telecom';
  if (d === 'Traction/OHE') return 'Electrical';
  return d;
};

/**
 * Initial seed data for realistic railway blocks (7-day week coverage)
 */
function generateSeedBlocks() {
  const today = new Date();
  const blocks = [];

  const getDate = (offset) => {
    const d = new Date(today);
    d.setDate(d.getDate() + offset);
    return d.toISOString().split('T')[0];
  };

  // Day 0 — Civil Works (Occupied)
  blocks.push({
    slotId: 'SLOT-2026-001', id: 'SLOT-2026-001',
    title: 'Track Renewal & Tamping', department: 'Civil',
    startTime: '09:00', endTime: '12:00',
    duration: '3 hours', durationMinutes: 180, durationHours: 3,
    status: 'Occupied', bookedBy: 'Rajesh Verma (SSE/P-Way)', inCharge: 'Rajesh Verma (SSE/P-Way)',
    date: getDate(0), dateLabel: String(new Date(getDate(0)).getDate()), dayIndex: new Date(getDate(0)).getDay(),
    section: 'NDLS - AGC Quadruple Corridor', track: 'Up Slow Line',
    colorKey: 'gold', deptTag: 'Civil Dept',
    description: 'Heavy ballast cleaning and track tamping at km 47.5 to 49.2',
    isClickable: false, adminCreated: true,
  });

  // Day 1 — Electrical Works (Occupied)
  blocks.push({
    slotId: 'SLOT-2026-002', id: 'SLOT-2026-002',
    title: 'OHE Maintenance & Insulator Wash', department: 'Electrical',
    startTime: '14:00', endTime: '17:00',
    duration: '3 hours', durationMinutes: 180, durationHours: 3,
    status: 'Occupied', bookedBy: 'Sunil Mehta (DEE/TRD)', inCharge: 'Sunil Mehta (DEE/TRD)',
    date: getDate(1), dateLabel: String(new Date(getDate(1)).getDate()), dayIndex: new Date(getDate(1)).getDay(),
    section: 'Faridabad - Tuglakabad', track: 'Main Line',
    colorKey: 'terracotta', deptTag: 'Electrical Dept',
    description: '25kV OHE insulator washing and cantilever alignment check',
    isClickable: false, adminCreated: true,
  });

  // Day 2 — Signal Works (Occupied)
  blocks.push({
    slotId: 'SLOT-2026-003', id: 'SLOT-2026-003',
    title: 'Signal & Interlocking Maintenance', department: 'Signal',
    startTime: '10:00', endTime: '13:00',
    duration: '3 hours', durationMinutes: 180, durationHours: 3,
    status: 'Occupied', bookedBy: 'Anand Sharma (SE/Signal)', inCharge: 'Anand Sharma (SE/Signal)',
    date: getDate(2), dateLabel: String(new Date(getDate(2)).getDate()), dayIndex: new Date(getDate(2)).getDay(),
    section: 'Palwal - Ballabgarh', track: 'Down Main Line',
    colorKey: 'teal', deptTag: 'Signal Dept',
    description: 'Electronic interlocking system test and axle counter reset',
    isClickable: false, adminCreated: true,
  });

  // Day 3 — Available Slot (2 hours)
  blocks.push({
    slotId: 'SLOT-2026-004', id: 'SLOT-2026-004',
    title: 'Available Maintenance Slot', department: null,
    startTime: '08:00', endTime: '10:00',
    duration: '2 hours', durationMinutes: 120, durationHours: 2,
    status: 'Available', bookedBy: null, inCharge: null,
    date: getDate(3), dateLabel: String(new Date(getDate(3)).getDate()), dayIndex: new Date(getDate(3)).getDay(),
    section: 'NDLS - MTJ Outer Yard', track: 'Up Slow Line',
    colorKey: 'white', deptTag: 'Available',
    description: 'Open for Junior Engineer booking',
    isClickable: true, adminCreated: true,
  });

  // Day 4 — Telecom Works (Occupied)
  blocks.push({
    slotId: 'SLOT-2026-005', id: 'SLOT-2026-005',
    title: 'Telecom Fiber Optic Cable Laying', department: 'Signal & Telecom',
    startTime: '11:00', endTime: '14:00',
    duration: '3 hours', durationMinutes: 180, durationHours: 3,
    status: 'Occupied', bookedBy: 'Pradeep Kumar (JE/Telecom)', inCharge: 'Pradeep Kumar (JE/Telecom)',
    date: getDate(4), dateLabel: String(new Date(getDate(4)).getDate()), dayIndex: new Date(getDate(4)).getDay(),
    section: 'Ghaziabad Junction', track: 'Platform 3-4 Bay',
    colorKey: 'purple', deptTag: 'Telecom Dept',
    description: 'Underground fiber optic cable installation for signaling system',
    isClickable: false, adminCreated: true,
  });

  // Day 5 — Available Slot (1 hour)
  blocks.push({
    slotId: 'SLOT-2026-006', id: 'SLOT-2026-006',
    title: 'Available Maintenance Slot', department: null,
    startTime: '15:00', endTime: '16:00',
    duration: '1 hour', durationMinutes: 60, durationHours: 1,
    status: 'Available', bookedBy: null, inCharge: null,
    date: getDate(5), dateLabel: String(new Date(getDate(5)).getDate()), dayIndex: new Date(getDate(5)).getDay(),
    section: 'Agra Cantt - Mathura Junction', track: 'Down Fast Line',
    colorKey: 'white', deptTag: 'Available',
    description: 'Open for Junior Engineer booking',
    isClickable: true, adminCreated: true,
  });

  // Day 6 — Mechanical Works (Occupied)
  blocks.push({
    slotId: 'SLOT-2026-007', id: 'SLOT-2026-007',
    title: 'Point Machine Overhauling', department: 'Mechanical',
    startTime: '13:00', endTime: '16:00',
    duration: '3 hours', durationMinutes: 180, durationHours: 3,
    status: 'Occupied', bookedBy: 'Manoj Singh (SSE/Works)', inCharge: 'Manoj Singh (SSE/Works)',
    date: getDate(6), dateLabel: String(new Date(getDate(6)).getDate()), dayIndex: new Date(getDate(6)).getDay(),
    section: 'Kota Junction Yard', track: 'Turnout No. 14',
    colorKey: 'gray', deptTag: 'Mechanical Dept',
    description: 'Complete overhauling of pneumatic point machine and switch alignment',
    isClickable: false, adminCreated: true,
  });

  return blocks;
}

// Ensure in-memory storage is seeded at startup
if (inMemoryBlocks.length === 0) {
  inMemoryBlocks = generateSeedBlocks();
}

/**
 * GET /api/blocks — Fetch all maintenance blocks
 */
const getAllBlocks = async (req, res, io) => {
  try {
    let blocks;
    let dataSource = 'memory';

    if (isMongoReady()) {
      try {
        blocks = await Block.find({}).sort({ date: 1, startTime: 1 });
        dataSource = 'mongodb';
        if (blocks.length === 0) {
          const seedData = generateSeedBlocks();
          blocks = await Block.insertMany(seedData);
          console.log(`[Blocks] Auto-seeded ${blocks.length} blocks to MongoDB`);
        }
      } catch (dbError) {
        console.warn('[MongoDB Query Error]:', dbError.message);
        blocks = inMemoryBlocks;
      }
    } else {
      blocks = inMemoryBlocks;
    }

    res.status(200).json({ success: true, count: blocks.length, dataSource, data: blocks });
  } catch (error) {
    console.error('[Get Blocks Error]:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch blocks' });
  }
};

/**
 * PUT /api/blocks/book/:id — Junior Engineer books a slot
 */
const bookBlock = async (req, res, io) => {
  try {
    const { id } = req.params;
    const { name, department, description } = req.body;

    if (!name || !department) {
      return res.status(400).json({ success: false, message: 'Engineer name and department are required' });
    }

    const colorKey = DEPT_COLOR_MAP[department] || 'gray';
    const deptTag = `${department} Dept`;
    const updateFields = {
      status: 'Occupied', bookedBy: name, inCharge: name,
      department, colorKey, deptTag,
      description: description || `Booked by ${name}`,
      isClickable: false,
    };

    let updatedBlock;
    let dataSource = 'memory';

    if (isMongoReady()) {
      try {
        updatedBlock = await Block.findOneAndUpdate(
          { $or: [{ slotId: id }, { _id: mongoose.isValidObjectId(id) ? id : undefined }].filter(Boolean) },
          { $set: updateFields },
          { new: true, runValidators: true }
        );
        if (updatedBlock) dataSource = 'mongodb';
      } catch (dbError) {
        console.warn('[MongoDB book error]:', dbError.message);
      }
    }

    if (!updatedBlock) {
      const idx = inMemoryBlocks.findIndex((b) => b.slotId === id || b.id === id);
      if (idx === -1) return res.status(404).json({ success: false, message: `Block '${id}' not found` });
      inMemoryBlocks[idx] = { ...inMemoryBlocks[idx], ...updateFields };
      updatedBlock = inMemoryBlocks[idx];
    }

    if (io) {
      io.emit('blockUpdated', updatedBlock);
      io.emit('block:booked', updatedBlock);
      io.emit('block:updated', updatedBlock);
    }

    res.status(200).json({ success: true, message: `Block booked by ${name}`, dataSource, data: updatedBlock });
  } catch (error) {
    console.error('[Book Block Error]:', error);
    res.status(500).json({ success: false, message: error.message || 'Booking failed' });
  }
};

/**
 * POST /api/blocks/available — Admin creates available slot
 */
const createAvailableSlot = async (req, res, io) => {
  try {
    const { duration, date, section, track, startTime } = req.body;

    if (!duration || !date || !startTime) {
      return res.status(400).json({ success: false, message: 'Duration, date, and start time are required' });
    }

    const durationMap = {
      '30 mins': { minutes: 30, hours: 0.5 },
      '1 hour': { minutes: 60, hours: 1 },
      '2 hours': { minutes: 120, hours: 2 },
      '3 hours': { minutes: 180, hours: 3 },
    };
    const dur = durationMap[duration] || { minutes: 60, hours: 1 };

    const [h, m] = startTime.split(':').map(Number);
    const endMins = h * 60 + m + dur.minutes;
    const endTime = `${String(Math.floor(endMins / 60) % 24).padStart(2, '0')}:${String(endMins % 60).padStart(2, '0')}`;

    const d = new Date(date + 'T12:00:00');
    const slotId = `SLOT-${Date.now()}`;

    const newBlock = {
      slotId, id: slotId,
      title: 'Available Maintenance Slot', department: null,
      startTime, endTime,
      duration, durationMinutes: dur.minutes, durationHours: dur.hours,
      status: 'Available', bookedBy: null, inCharge: null,
      date, dateLabel: String(d.getDate()), dayIndex: d.getDay(),
      section: section || 'General Section', track: track || 'Main Line',
      colorKey: 'white', deptTag: 'Available',
      description: 'Open for Junior Engineer booking',
      isClickable: true, adminCreated: true,
    };

    let savedBlock = newBlock;
    let dataSource = 'memory';

    if (isMongoReady()) {
      try {
        const blockDoc = new Block(newBlock);
        savedBlock = await blockDoc.save();
        dataSource = 'mongodb';
      } catch (dbError) {
        console.warn('[MongoDB create slot error]:', dbError.message);
        inMemoryBlocks.push(newBlock);
      }
    } else {
      inMemoryBlocks.push(newBlock);
    }

    if (io) io.emit('block:created', savedBlock);

    res.status(201).json({ success: true, message: 'Available slot created', dataSource, data: savedBlock });
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

    let deletedBlock;
    let dataSource = 'memory';

    if (isMongoReady()) {
      try {
        const orConditions = [{ slotId }];
        if (mongoose.isValidObjectId(slotId)) orConditions.push({ _id: slotId });
        deletedBlock = await Block.findOneAndDelete({ $or: orConditions });
        if (deletedBlock) dataSource = 'mongodb';
      } catch (dbError) {
        console.warn('[MongoDB delete error]:', dbError.message);
      }
    }

    if (!deletedBlock) {
      const idx = inMemoryBlocks.findIndex((b) => b.slotId === slotId || b.id === slotId);
      if (idx === -1) return res.status(404).json({ success: false, message: `Block '${slotId}' not found` });
      deletedBlock = inMemoryBlocks[idx];
      inMemoryBlocks.splice(idx, 1);
    }

    if (io) {
      io.emit('block:deleted', { slotId });
      io.emit('blockDeleted', { slotId });
    }

    res.status(200).json({ success: true, message: 'Block deleted by administrator', dataSource, data: deletedBlock });
  } catch (error) {
    console.error('[Delete Block Error]:', error);
    res.status(500).json({ success: false, message: error.message || 'Delete failed' });
  }
};

/**
 * POST /api/blocks/reset — Clear and re-seed schedule
 */
const resetSchedule = async (req, res, io) => {
  try {
    let blocks;
    let dataSource = 'memory';

    if (isMongoReady()) {
      try {
        await Block.deleteMany({});
        const seedData = generateSeedBlocks();
        blocks = await Block.insertMany(seedData);
        dataSource = 'mongodb';
        console.log('[Blocks] Schedule reset in MongoDB');
      } catch (dbError) {
        console.warn('[MongoDB reset error]:', dbError.message);
        inMemoryBlocks = generateSeedBlocks();
        blocks = inMemoryBlocks;
      }
    } else {
      inMemoryBlocks = generateSeedBlocks();
      blocks = inMemoryBlocks;
    }

    if (io) io.emit('timeline:reset', blocks);

    res.status(200).json({ success: true, message: 'Schedule reset', dataSource, count: blocks.length, data: blocks });
  } catch (error) {
    console.error('[Reset Error]:', error);
    res.status(500).json({ success: false, message: error.message || 'Reset failed' });
  }
};

/**
 * POST /api/blocks — Create a maintenance block or block request
 */
const createBlock = async (req, res, io) => {
  try {
    const {
      title,
      department,
      location,
      section,
      track,
      startTime,
      endTime,
      duration,
      date,
      issue,
      criticality,
      urgency,
      requiredWorkers,
      requiredEquipment,
      inCharge,
      bookedBy,
      status,
    } = req.body;

    if (!date || !startTime) {
      return res.status(400).json({ success: false, message: 'Date and start time are required' });
    }

    const normDept = normalizeDepartment(department);
    const colorKey = DEPT_COLOR_MAP[normDept] || DEPT_COLOR_MAP[department] || 'teal';
    const deptTag = normDept ? `${normDept} Dept` : 'Maintenance';

    let durMinutes = 60;
    let durHours = 1;
    let computedEndTime = endTime;

    if (startTime && endTime) {
      const [sh, sm] = startTime.split(':').map(Number);
      let [eh, em] = endTime.split(':').map(Number);
      let diff = (eh * 60 + em) - (sh * 60 + sm);
      if (diff < 0) diff += 24 * 60;
      if (diff > 0) {
        durMinutes = diff;
        durHours = +(diff / 60).toFixed(1);
      }
    } else if (duration) {
      const durationMap = {
        '30 mins': { minutes: 30, hours: 0.5 },
        '1 hour': { minutes: 60, hours: 1 },
        '2 hours': { minutes: 120, hours: 2 },
        '3 hours': { minutes: 180, hours: 3 },
      };
      if (durationMap[duration]) {
        durMinutes = durationMap[duration].minutes;
        durHours = durationMap[duration].hours;
      } else {
        const parsed = parseFloat(duration);
        if (!isNaN(parsed) && parsed > 0) {
          durHours = parsed;
          durMinutes = Math.round(parsed * 60);
        }
      }
    }

    if (!computedEndTime) {
      const [h, m] = startTime.split(':').map(Number);
      const endMins = h * 60 + m + durMinutes;
      computedEndTime = `${String(Math.floor(endMins / 60) % 24).padStart(2, '0')}:${String(endMins % 60).padStart(2, '0')}`;
    }

    const d = new Date(date + 'T12:00:00');
    const slotId = `BLOCK-${Date.now()}`;
    const blockTitle = title || issue || `${normDept || 'Maintenance'} Work`;

    const newBlock = {
      slotId,
      id: slotId,
      title: blockTitle,
      department: normDept,
      startTime,
      endTime: computedEndTime,
      duration: `${durHours} hour${durHours === 1 ? '' : 's'}`,
      durationMinutes: durMinutes,
      durationHours: durHours,
      status: status || 'Occupied',
      bookedBy: bookedBy || inCharge || `${normDept || 'Engineering'} Team`,
      inCharge: inCharge || bookedBy || `${normDept || 'Engineering'} Team`,
      date,
      dateLabel: String(d.getDate()),
      dayIndex: d.getDay(),
      section: section || location || 'NDLS - AGC Quadruple Corridor',
      track: track || 'Main Line',
      colorKey,
      deptTag,
      description: issue || title || 'Maintenance block scheduled',
      isClickable: false,
      adminCreated: false,
    };

    let savedBlock = newBlock;
    let dataSource = 'memory';

    if (isMongoReady()) {
      try {
        const blockDoc = new Block(newBlock);
        savedBlock = await blockDoc.save();
        dataSource = 'mongodb';
      } catch (dbError) {
        console.warn('[MongoDB createBlock error]:', dbError.message);
        inMemoryBlocks.push(newBlock);
      }
    } else {
      inMemoryBlocks.push(newBlock);
    }

    if (io) {
      io.emit('blockCreated', savedBlock);
      io.emit('block:created', savedBlock);
      io.emit('blockUpdated', savedBlock);
    }

    res.status(201).json({ success: true, message: 'Block created successfully', dataSource, data: savedBlock });
  } catch (error) {
    console.error('[Create Block Error]:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to create block' });
  }
};

module.exports = { getAllBlocks, bookBlock, createAvailableSlot, deleteBlock, resetSchedule, createBlock };
