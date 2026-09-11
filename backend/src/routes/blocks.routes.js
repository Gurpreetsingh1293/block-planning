const express = require('express');
const router = express.Router();
const {
  getAllBlocks,
  bookBlock,
  createAvailableSlot,
  deleteBlock,
  resetSchedule,
  createBlock,
} = require('../controllers/blocks.controller');

// Middleware to inject Socket.io into request handlers
const withIo = (handler) => (req, res) => {
  const io = req.app.get('io');
  return handler(req, res, io);
};

/**
 * GET /api/blocks
 * Fetch all maintenance blocks sorted by date/time
 * Auto-seeds 7 initial blocks if collection is empty
 */
router.get('/', withIo(getAllBlocks));

/**
 * POST /api/blocks
 * POST /api/blocks/request
 * Create a new maintenance block or submit a block request
 */
router.post('/', withIo(createBlock));
router.post('/request', withIo(createBlock));

/**
 * POST /api/blocks/available
 * Admin: Designate a new available slot
 * Body: { duration, date, section, track, startTime }
 */
router.post('/available', withIo(createAvailableSlot));

/**
 * POST /api/blocks/reset
 * Clear and re-seed the standard schedule
 */
router.post('/reset', withIo(resetSchedule));

/**
 * PUT /api/blocks/book/:id
 * Junior Engineer books an available slot
 * Body: { name, department, description }
 */
router.put('/book/:id', withIo(bookBlock));

/**
 * DELETE /api/blocks/:slotId
 * Admin-only: Delete a block by slotId
 * Requires x-user-role: admin header or ?role=admin query param
 */
router.delete('/:slotId', withIo(deleteBlock));

module.exports = router;
