import React from 'react';
import { CheckCircle2, Circle, Clock, MapPin, AlertCircle, ArrowDown } from 'lucide-react';
import { formatDelayText } from '../../utils/formatters';

export default function StationTimeline({
  stations = [],
  currentStationCode,
  nextStationCode,
  onSelectStation,
  selectedStationCode
}) {
  if (!stations || stations.length === 0) {
    return (
      <div className="timeline-empty-state">
        <MapPin size={24} className="empty-icon" />
        <p>No station schedule available for this train</p>
      </div>
    );
  }

  // Find index of current station or last visited station
  const currentIndex = stations.findIndex(
    (s) => (s.code || s.stationCode) === currentStationCode
  );

  return (
    <div className="station-timeline-container">
      <div className="timeline-header">
        <h4 className="timeline-title">
          <Clock size={16} /> Route & Stoppage Timeline
        </h4>
        <span className="timeline-count">{stations.length} Halts</span>
      </div>

      <div className="timeline-list">
        {stations.map((stn, idx) => {
          const code = stn.code || stn.stationCode || '';
          const name = stn.name || stn.stationName || code;
          const isPassed = currentIndex !== -1 ? idx < currentIndex : false;
          const isCurrent = (code === currentStationCode) || (currentIndex === -1 && idx === 0);
          const isNext = (code === nextStationCode) || (currentIndex !== -1 && idx === currentIndex + 1);
          const isSelected = selectedStationCode === code;
          const delayMin = stn.delayMinutes !== undefined ? stn.delayMinutes : (stn.delay || 0);

          let statusClass = 'status-upcoming';
          if (isPassed) statusClass = 'status-passed';
          if (isCurrent) statusClass = 'status-current';
          if (isNext && !isCurrent) statusClass = 'status-next';

          return (
            <div
              key={`${code}-${idx}`}
              className={`timeline-item ${statusClass} ${isSelected ? 'is-selected' : ''}`}
              onClick={() => onSelectStation && onSelectStation(stn)}
            >
              {/* Connecting vertical line */}
              {idx < stations.length - 1 && (
                <div className={`timeline-connector ${isPassed ? 'connector-passed' : ''}`} />
              )}

              {/* Node Icon */}
              <div className="timeline-node">
                {isPassed ? (
                  <CheckCircle2 size={18} className="node-icon icon-passed" />
                ) : isCurrent ? (
                  <div className="node-current-pulse">
                    <div className="pulse-dot" />
                  </div>
                ) : (
                  <Circle size={14} className="node-icon icon-upcoming" />
                )}
              </div>

              {/* Station Info Content */}
              <div className="timeline-content">
                <div className="timeline-row-top">
                  <div className="station-name-group">
                    <span className="station-code-badge">{code}</span>
                    <span className="station-name-text">{name}</span>
                  </div>
                  {delayMin > 0 ? (
                    <span className="delay-badge delay-late">
                      +{delayMin}m late
                    </span>
                  ) : (
                    <span className="delay-badge delay-ontime">
                      On Time
                    </span>
                  )}
                </div>

                <div className="timeline-row-bottom">
                  <div className="timeline-times">
                    {stn.scheduledArrival && (
                      <span className="time-item">
                        <span className="time-label">Arr:</span> {stn.actualArrival || stn.scheduledArrival}
                      </span>
                    )}
                    {stn.scheduledDeparture && (
                      <span className="time-item">
                        <span className="time-label">Dep:</span> {stn.actualDeparture || stn.scheduledDeparture}
                      </span>
                    )}
                  </div>
                  <div className="timeline-meta">
                    {stn.platform && (
                      <span className="platform-tag">PF {stn.platform}</span>
                    )}
                    {stn.distanceKm !== undefined && (
                      <span className="distance-tag">{stn.distanceKm} km</span>
                    )}
                  </div>
                </div>

                {/* Sub status message for current / next */}
                {isCurrent && (
                  <div className="current-status-banner">
                    <span className="live-dot" /> Currently at / passed {name}
                  </div>
                )}
                {isNext && !isCurrent && (
                  <div className="next-status-banner">
                    <ArrowDown size={12} /> Next Upcoming Halt
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
