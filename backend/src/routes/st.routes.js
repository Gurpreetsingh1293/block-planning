const express = require('express');
const router = express.Router();
const {
  getSTTasks,
  updateSTTaskStatus,
  getSTCorridor,
} = require('../controllers/st.controller');

// GET /api/st/tasks - List S&T maintenance tasks
router.get('/tasks', getSTTasks);

// PATCH /api/st/tasks/:id - Update task status
router.patch('/tasks/:id', updateSTTaskStatus);

// GET /api/st/corridor - Delhi-Mumbai operational overview
router.get('/corridor', getSTCorridor);

module.exports = router;
