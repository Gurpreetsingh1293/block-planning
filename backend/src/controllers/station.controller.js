const Station = require('../models/Station');
const Timetable = require('../models/Timetable');

/**
 * GET /api/stations
 * Returns list of stations along the trunk corridor
 */
const getStations = async (req, res) => {
  try {
    const stations = await Station.findAll({
      order: [['km_position', 'ASC']],
    });
    res.json({
      success: true,
      count: stations.length,
      data: stations,
    });
  } catch (err) {
    console.error('[Station Controller Error]:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * GET /api/stations/:code/timetable
 * Returns live arrival & departure platform monitor for a station
 */
const getStationTimetable = async (req, res) => {
  try {
    const { code } = req.params;
    const stationCode = (code || 'NDLS').toUpperCase();

    const station = await Station.findByPk(stationCode);
    const entries = await Timetable.findAll({
      where: { stationCode },
      order: [['time', 'ASC']],
    });

    const payload = {
      success: true,
      stationCode: station?.code || stationCode,
      stationName: station?.name || 'NEW DELHI',
      date: 'TODAY',
      displayDate: new Date().toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' }),
      count: entries.length,
      entries,
      data: {
        stationCode: station?.code || stationCode,
        stationName: station?.name || 'NEW DELHI',
        entries,
      },
    };

    res.json(payload);
  } catch (err) {
    console.error('[Timetable Controller Error]:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  getStations,
  getStationTimetable,
};
