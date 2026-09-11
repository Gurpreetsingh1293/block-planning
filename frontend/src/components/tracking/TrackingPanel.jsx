import React from 'react';
import TrainHeaderCard from './TrainHeaderCard';
import StationTimeline from './StationTimeline';
import { Train, Radio } from 'lucide-react';

export default function TrackingPanel({
  train,
  telemetry,
  routeData,
  onClose,
  onSelectStation,
  selectedStationCode
}) {
  if (!train) {
    return (
      <div className="tracking-detail-panel empty-panel">
        <div className="empty-panel-content">
          <Train size={36} className="empty-icon text-muted" />
          <p className="empty-title">Select a Train to Track</p>
          <span className="empty-desc">
            Search a train number or click any active rake on the map to inspect live speed, delay, and stoppage timeline.
          </span>
        </div>
      </div>
    );
  }

  const stations = routeData?.stations || train.stops?.map((s) => ({
    code: s.stationCode || s.station,
    name: s.stationName || s.station,
    scheduledArrival: s.scheduled,
    scheduledDeparture: s.scheduled,
    platform: s.platform || '1',
    delayMinutes: train.delayMinutes || 0
  })) || [];

  return (
    <div className="tracking-sidebar-content-stack" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
      {/* 1. Live Telemetry & Progress Card */}
      <TrainHeaderCard
        train={train}
        telemetry={telemetry}
        onClose={onClose}
      />

      {/* 2. Route & Stoppage Timeline */}
      <StationTimeline
        stations={stations}
        currentStationCode={telemetry?.currentStation || train.currentStation}
        nextStationCode={telemetry?.nextStation || train.nextStation}
        onSelectStation={onSelectStation}
        selectedStationCode={selectedStationCode}
      />
    </div>
  );
}

