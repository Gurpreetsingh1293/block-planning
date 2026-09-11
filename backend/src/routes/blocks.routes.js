const express = require('express');
const router = express.Router();
const {
  getAllBlocks,
  bookBlock,
  createAvailableSlot,
  deleteBlock,
  resetSchedule,
  getConflicts,
  optimizeSchedule,
  getBlockPlanning,
} = require('../controllers/blocks.controller');

// Middleware to inject Socket.io into request handlers
const withIo = (handler) => (req, res) => {
  const io = req.app.get('io');
  return handler(req, res, io);
};

/**
 * 1. Specific Static Routes (must precede parameterized routes)
 */

// GET /api/blocks/planning — Dedicated block planning records with officer relations
router.get('/planning', getBlockPlanning);

// GET /api/blocks/conflicts — Active schedule conflicts & delays
router.get('/conflicts', getConflicts);

// POST /api/blocks/optimize — AI slot shifting & bottleneck elimination
router.post('/optimize', withIo(optimizeSchedule));

// POST /api/blocks/available — Admin designates new available slot
router.post('/available', withIo(createAvailableSlot));

// POST /api/blocks/reset — Clear and re-seed baseline schedule
router.post('/reset', withIo(resetSchedule));

// PUT /api/blocks/book/:id — Junior Engineer books an available slot
router.put('/book/:id', withIo(bookBlock));

/**
 * 2. Root Collection Route
 */

// GET /api/blocks — Fetch all maintenance blocks
router.get('/', getAllBlocks);

/**
 * 3. Parameterized Item Routes
 */

// DELETE /api/blocks/:slotId — Admin-only block deletion
router.delete('/:slotId', withIo(deleteBlock));

module.exports = router;
