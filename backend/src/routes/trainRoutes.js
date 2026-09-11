const express = require('express');
const router = express.Router();
const { railRadar } = require('../providers/railRadarAdapter');

// 1. Train Search: GET /api/trains/search?q=...&type=...
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q || '';
    const type = req.query.type || 'ALL';
    let results = await railRadar.searchTrains(query);

    if (type === 'PASSENGER') {
      results = results.filter((t) => t.trainType !== 'Freight');
    } else if (type === 'CARGO') {
      results = results.filter((t) => t.trainType === 'Freight');
    }

    const formattedTrains = results.map((t) => ({
      id: t.trainNumber,
      number: t.trainNumber,
      name: t.trainName,
      type: t.trainType?.toUpperCase() === 'FREIGHT' ? 'CARGO' : 'PASSENGER',
      source: t.source?.name || t.source?.code || t.source || 'Source',
      destination: t.destination?.name || t.destination?.code || t.destination || 'Destination',
      departureTime: t.departureTime,
      arrivalTime: t.arrivalTime,
      status: 'On Time',
      runsOn: t.runsOn || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    }));

    res.json({
      success: true,
      count: formattedTrains.length,
      trains: formattedTrains,
      data: results
    });
  } catch (err) {
    console.error('[Train Routes] Search error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Train Live Telemetry: GET /api/trains/:number/live?date=...
router.get('/:number/live', async (req, res) => {
  try {
    const { number } = req.params;
    const date = req.query.date || new Date().toISOString().split('T')[0];
    const live = await railRadar.getLiveStatus(number, date);

    if (!live) {
      return res.status(404).json({
        success: false,
        message: `Live telemetry for train ${number} not found.`,
      });
    }

    const currentStnName = live.currentStation?.name || live.currentStation?.code || 'En Route';
    const nextStnName = live.nextStation?.name || live.nextStation?.code || 'Upcoming';

    res.json({
      success: true,
      train: {
        id: live.trainNumber,
        number: live.trainNumber,
        name: live.trainName,
        type: live.trainType || 'PASSENGER',
        source: live.source?.name || live.source?.code || 'Source',
        destination: live.destination?.name || live.destination?.code || 'Destination',
        speed: live.currentLocation?.speedKmh || 0,
        delayMinutes: live.delayMinutes || 0,
        currentStation: currentStnName,
        nextStation: nextStnName,
        etaNext: live.etaNextStation || '14:20',
        progressPercent: live.completionPercent || 45,
        isElectric: true,
        bearing: live.currentLocation?.bearing || 0,
        coordinates: {
          lat: live.currentLocation?.lat,
          lng: live.currentLocation?.lng
        }
      },
      telemetry: {
        speedKmh: live.currentLocation?.speedKmh || 0,
        delayMinutes: live.delayMinutes || 0,
        currentStation: currentStnName,
        nextStation: nextStnName,
        etaNextStation: live.etaNextStation || '14:20',
        distanceCoveredKm: live.distanceCoveredKm,
        distanceRemainingKm: live.distanceRemainingKm,
        totalDistanceKm: live.totalDistanceKm,
        lastUpdated: live.updatedAt || new Date().toISOString()
      },
      data: live
    });
  } catch (err) {
    console.error(`[Train Routes] Live error for ${req.params.number}:`, err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Train Route Geometry & Stations: GET /api/trains/:number/route?date=...
router.get('/:number/route', async (req, res) => {
  try {
    const { number } = req.params;
    const date = req.query.date || new Date().toISOString().split('T')[0];
    const route = await railRadar.getRoute(number, date);

    if (!route) {
      return res.status(404).json({
        success: false,
        message: `Route geometry for train ${number} not found.`,
      });
    }

    res.json({
      success: true,
      route: {
        trainNumber: route.trainNumber,
        trainName: route.trainName,
        geometry: {
          type: 'LineString',
          coordinates: route.polyline || []
        },
        stations: route.stations?.map((s) => ({
          code: s.stationCode || s.code,
          name: s.stationName || s.name || s.stationCode,
          latitude: s.latitude || s.lat,
          longitude: s.longitude || s.lng,
          lat: s.lat || s.latitude,
          lng: s.lng || s.longitude,
          distanceKm: s.distanceFromSourceKm || s.distanceKm || 0,
          distanceFromSourceKm: s.distanceFromSourceKm || s.distanceKm || 0,
          scheduledArrival: s.scheduledArrival,
          scheduledDeparture: s.scheduledDeparture,
          actualArrival: s.actualArrival || s.expectedArrival || s.scheduledArrival,
          actualDeparture: s.actualDeparture || s.expectedDeparture || s.scheduledDeparture,
          platform: s.platform || '1',
          delayMinutes: s.delayMinutes || 0
        })) || []
      },
      data: route
    });
  } catch (err) {
    console.error(`[Train Routes] Route error for ${req.params.number}:`, err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Train Analytics: GET /api/trains/:number/analytics?date=...
router.get('/:number/analytics', async (req, res) => {
  try {
    const { number } = req.params;
    const date = req.query.date || new Date().toISOString().split('T')[0];
    const analytics = await railRadar.getAnalytics(number, date);

    if (!analytics) {
      return res.status(404).json({
        success: false,
        message: `Analytics for train ${number} not found.`,
      });
    }

    res.json({
      success: true,
      analytics,
      data: analytics
    });
  } catch (err) {
    console.error(`[Train Routes] Analytics error for ${req.params.number}:`, err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Default List: GET /api/trains
router.get('/', async (req, res) => {
  try {
    const results = await railRadar.searchTrains('');
    res.json({ success: true, count: results.length, data: results });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
