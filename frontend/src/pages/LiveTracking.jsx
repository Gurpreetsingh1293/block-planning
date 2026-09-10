import React, { useState } from 'react';
import PageHeader from '../components/layout/PageHeader';
import PassengerCargoToggle from '../components/tracking/PassengerCargoToggle';
import TrainSearch from '../components/tracking/TrainSearch';
import TrackingMap from '../components/tracking/TrackingMap';
import TrackingPanel from '../components/tracking/TrackingPanel';
import { useTracking } from '../hooks/useTracking';
import { STATIONS } from '../data/stations';
import { Radio, RefreshCw } from 'lucide-react';
import Button from '../components/common/Button';

export default function LiveTracking() {
  const {
    viewType,
    setViewType,
    trains,
    selectedTrain,
    setSelectedTrain,
    metrics,
    loading,
    searchFilter,
    setSearchFilter,
    refetch
  } = useTracking('PASSENGER');

  const [stationFilter, setStationFilter] = useState('');

  // Further filter trains by station if chosen
  const displayedTrains = trains.filter((t) => {
    if (!stationFilter) return true;
    return t.currentStation.includes(stationFilter) || t.nextStation.includes(stationFilter);
  });

  return (
    <div className="live-tracking-page-container">
      {/* 1. Feature Introduction (Top) */}
      <PageHeader
        title="Know Where Every Movement Stands."
        subtitle="Monitor passenger and cargo movement through a unified live operational view."
        chips={[
          `${metrics?.totalMonitored || 124} Trains Monitored`,
          `${metrics?.onTime || 118} On Time`,
          `${metrics?.delayed || 6} Delayed`,
          `Avg Speed: ${metrics?.averageNetworkSpeed || '94.2 km/h'}`
        ]}
        actions={
          <div className="tracking-top-actions">
            <PassengerCargoToggle
              value={viewType}
              onChange={(mode) => setViewType(mode)}
            />
            <Button
              variant="outline"
              size="sm"
              icon={RefreshCw}
              onClick={refetch}
              title="Refresh Live Movement"
            >
              Refresh
            </Button>
          </div>
        }
      />

      {/* 2. Search and Filter Bar */}
      <div className="tracking-filter-bar">
        <TrainSearch
          searchValue={searchFilter}
          onSearchChange={setSearchFilter}
          stationFilter={stationFilter}
          onStationChange={setStationFilter}
          stations={STATIONS}
        />
      </div>

      {/* 3. Main Full-Width Split: Map (Left/Center) + Telemetry Detail Panel (Right) */}
      <div className="tracking-workspace-grid">
        <div className="tracking-map-wrapper">
          <TrackingMap
            trains={displayedTrains}
            selectedTrain={selectedTrain}
            onSelectTrain={setSelectedTrain}
            viewType={viewType}
          />
        </div>

        <div className="tracking-sidebar-wrapper">
          <TrackingPanel
            train={selectedTrain}
            onClose={() => setSelectedTrain(null)}
          />
        </div>
      </div>
    </div>
  );
}
