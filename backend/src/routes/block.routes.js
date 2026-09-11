const express = require('express');
const router = express.Router();
const {
  getBlocks,
  getConflicts,
  applyOptimization,
  resetBlocks,
} = require('../controllers/block.controller');

// GET /api/blocks - List all maintenance blocks with filters
router.get('/', getBlocks);

// GET /api/blocks/conflicts - List schedule conflicts
router.get('/conflicts', getConflicts);

// POST /api/blocks/optimize - Apply AI slot shift
router.post('/optimize', applyOptimization);

// POST /api/blocks/reset - Reset schedule to baseline
router.post('/reset', resetBlocks);

module.exports = router;
