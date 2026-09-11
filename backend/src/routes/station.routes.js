const express = require('express');
const router = express.Router();
const {
  getStations,
  getStationTimetable,
} = require('../controllers/station.controller');

// GET /api/stations - List all corridor stations
router.get('/', getStations);

// GET /api/stations/:code/timetable - Live arrival/departure board
router.get('/:code/timetable', getStationTimetable);

module.exports = router;
