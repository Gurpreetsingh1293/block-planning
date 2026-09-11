import React, { useState, useEffect, useCallback, useRef } from 'react';
import PageHeader from '../components/layout/PageHeader';
import PassengerCargoToggle from '../components/tracking/PassengerCargoToggle';
import TrainSearch from '../components/tracking/TrainSearch';
import LiveMap from '../components/tracking/LiveMap';
import TrackingMap from '../components/tracking/TrackingMap';
import TrackingPanel from '../components/tracking/TrackingPanel';
import { useTracking } from '../hooks/useTracking';
import { getLiveTrainStatus, getTrainRoute, searchTrains } from '../services/trainService';
import { STATIONS } from '../data/stations';
import { Radio, RefreshCw, Map as MapIcon, Grid } from 'lucide-react';
import Button from '../components/common/Button';

export default function LiveTracking() {
  const {
    viewType,
    setViewType,
    trains,
    allTrains,
    selectedTrain,
    setSelectedTrain,
    metrics,
    loading,
    searchFilter,
    setSearchFilter,
    refetch
  } = useTracking('PASSENGER');

  const [stationFilter, setStationFilter] = useState('');
  const [mapMode, setMapMode] = useState('MAPLIBRE'); // 'MAPLIBRE' | 'SCHEMATIC'
  const [routeData, setRouteData] = useState(null);
  const [telemetry, setTelemetry] = useState(null);
  const [livePosition, setLivePosition] = useState(null);
  const [selectedStationCode, setSelectedStationCode] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // 1. Fetch live route and telemetry when train selection changes
  const loadTrainLiveTelemetry = useCallback(async (train) => {
    if (!train || !train.number) return;
    try {
      const [liveRes, routeRes] = await Promise.all([
        getLiveTrainStatus(train.number),
        getTrainRoute(train.number)
      ]);

      if (liveRes && liveRes.telemetry) {
        setTelemetry(liveRes.telemetry);
        if (liveRes.train?.coordinates) {
          setLivePosition({
            latitude: liveRes.train.coordinates.lat || liveRes.train.coordinates.latitude || 28.6139,
            longitude: liveRes.train.coordinates.lng || liveRes.train.coordinates.longitude || 77.2090,
            bearing: liveRes.train.bearing || 160,
            speedKmh: liveRes.telemetry.speedKmh || liveRes.train.speed || 95,
            timestamp: liveRes.telemetry.lastUpdated
          });
        }
      }

      if (routeRes && (routeRes.route || routeRes.data || routeRes.stations || routeRes.polyline)) {
        setRouteData(routeRes.route || routeRes.data || routeRes);
      }
    } catch (err) {
      console.warn('Failed to load live telemetry:', err);
    }
  }, []);

  useEffect(() => {
    if (selectedTrain) {
      loadTrainLiveTelemetry(selectedTrain);
    }
  }, [selectedTrain, loadTrainLiveTelemetry]);

  // Debounced search query
  useEffect(() => {
    if (!searchFilter || !searchFilter.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = await searchTrains(searchFilter, viewType);
        setSearchResults(results || []);
      } catch (err) {
        console.warn('Train search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [searchFilter, viewType]);

  const handleSelectTrain = (train) => {
    setSelectedTrain(train);
    loadTrainLiveTelemetry(train);
  };

  // 2. Periodic polling interval (every 15 seconds) for live position updates
  useEffect(() => {
    if (!selectedTrain) return;

    const intervalId = setInterval(() => {
      loadTrainLiveTelemetry(selectedTrain);
    }, 15000);

    return () => clearInterval(intervalId);
  }, [selectedTrain, loadTrainLiveTelemetry]);

  // Manual refresh handler
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      refetch(),
      selectedTrain ? loadTrainLiveTelemetry(selectedTrain) : Promise.resolve()
    ]);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  // Station filter for trains list
  const displayedTrains = trains.filter((t) => {
    if (!stationFilter) return true;
    return (
      t.currentStation?.toLowerCase().includes(stationFilter.toLowerCase()) ||
      t.nextStation?.toLowerCase().includes(stationFilter.toLowerCase())
    );
  });

  return (
    <div className="live-tracking-page-container">
      {/* 1. Feature Introduction (Top) */}
      <PageHeader
        title="Know Where Every Movement Stands."
        subtitle="Monitor passenger and cargo movement through high-precision live GPS telemetry and GeoJSON routing."
        chips={[
          `${metrics?.totalMonitored || 124} Trains Monitored`,
          `${metrics?.onTime || 118} On Time`,
          `${metrics?.delayed || 6} Delayed`,
          `Avg Speed: ${metrics?.averageNetworkSpeed || '94.2 km/h'}`
        ]}
        actions={
          <div className="tracking-top-actions">
            {/* View Mode Toggle: Interactive Map vs Schematic */}
            <div className="passenger-cargo-toggle-control">
              <button
                type="button"
                className={`mode-toggle-btn ${mapMode === 'MAPLIBRE' ? 'mode-active' : ''}`}
                onClick={() => setMapMode('MAPLIBRE')}
                title="Geographic Map View"
              >
                <MapIcon size={14} /> Map
              </button>
              <button
                type="button"
                className={`mode-toggle-btn ${mapMode === 'SCHEMATIC' ? 'mode-active' : ''}`}
                onClick={() => setMapMode('SCHEMATIC')}
                title="Section Track Schematic"
              >
                <Grid size={14} /> Schematic
              </button>
            </div>

            <PassengerCargoToggle
              value={viewType}
              onChange={(mode) => setViewType(mode)}
            />

            <Button
              variant="outline"
              size="sm"
              icon={RefreshCw}
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              title="Refresh Live Telemetry"
            >
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        }
      />

      {/* 2. Search and Filter Bar */}
      <div className="tracking-filter-bar">
        <TrainSearch
          searchValue={searchFilter}
          onSearchChange={setSearchFilter}
          searchResults={searchResults}
          onSelectTrain={handleSelectTrain}
          isSearching={isSearching}
          stationFilter={stationFilter}
          onStationChange={setStationFilter}
          stations={STATIONS}
        />
      </div>

      {/* 3. Main Full-Width Split: Map (Left/Center) + Telemetry Detail Panel (Right) */}
      <div className="tracking-workspace-grid">
        <div className="tracking-map-wrapper">
          {mapMode === 'MAPLIBRE' ? (
            <LiveMap
              selectedTrain={selectedTrain}
              routeData={routeData}
              livePosition={livePosition}
              allTrains={displayedTrains}
              onSelectTrain={handleSelectTrain}
              onSelectStation={(stn) => setSelectedStationCode(stn.code || stn.stationCode)}
            />
          ) : (
            <TrackingMap
              trains={displayedTrains}
              selectedTrain={selectedTrain}
              onSelectTrain={handleSelectTrain}
              viewType={viewType}
            />
          )}
        </div>

        <div className="tracking-sidebar-wrapper">
          <TrackingPanel
            train={selectedTrain}
            telemetry={telemetry}
            routeData={routeData}
            onClose={() => setSelectedTrain(null)}
            onSelectStation={(stn) => setSelectedStationCode(stn.code || stn.stationCode)}
            selectedStationCode={selectedStationCode}
          />
        </div>
      </div>
    </div>
  );
}

