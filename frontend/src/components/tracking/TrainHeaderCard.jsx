import React from 'react';
import { Gauge, Clock, Navigation, MapPin, Zap, AlertTriangle, ShieldCheck, X } from 'lucide-react';
import { formatSpeedKmh, formatDelayText } from '../../utils/formatters';

export default function TrainHeaderCard({
  train,
  telemetry,
  onClose
}) {
  if (!train) return null;

  const currentSpeed = telemetry?.speedKmh ?? train.speed ?? 0;
  const currentDelay = telemetry?.delayMinutes ?? train.delayMinutes ?? 0;
  const currentStation = telemetry?.currentStation ?? train.currentStation ?? '--';
  const nextStation = telemetry?.nextStation ?? train.nextStation ?? '--';
  const etaNext = telemetry?.etaNextStation ?? train.etaNext ?? '--';
  const progressPercent = train.progressPercent ?? 45;

  return (
    <div className="train-header-card">
      <div className="train-card-topbar">
        <div className="train-id-badge-group">
          <span className="train-number-pill">{train.number}</span>
          <span className="train-type-pill">{train.type || 'EXPRESS'}</span>
          {train.isElectric && (
            <span className="train-elec-pill">
              <Zap size={12} /> 25kV OHE
            </span>
          )}
        </div>
        {onClose && (
          <button className="train-card-close-btn" onClick={onClose} title="Close Panel">
            <X size={16} />
          </button>
        )}
      </div>

      <div className="train-title-row">
        <h3 className="train-name-heading">{train.name}</h3>
      </div>

      <div className="train-od-strip">
        <span className="od-station origin">{train.source || train.origin || 'Source'}</span>
        <span className="od-arrow">➔</span>
        <span className="od-station destination">{train.destination || 'Destination'}</span>
      </div>

      {/* Primary Telemetry Grid */}
      <div className="telemetry-metrics-grid">
        {/* Speed Gauge */}
        <div className="telemetry-box speed-box">
          <div className="box-icon-label">
            <Gauge size={14} className="metric-icon" />
            <span>SPEED</span>
          </div>
          <div className="metric-primary-value">
            {formatSpeedKmh(currentSpeed)}
          </div>
          <div className="metric-sub-label">
            Max: {train.maxPermissibleSpeed || '130'} km/h
          </div>
        </div>

        {/* Delay Status */}
        <div className={`telemetry-box delay-box ${currentDelay > 0 ? 'is-late' : 'is-ontime'}`}>
          <div className="box-icon-label">
            <Clock size={14} className="metric-icon" />
            <span>PUNCTUALITY</span>
          </div>
          <div className="metric-primary-value">
            {currentDelay > 0 ? `+${currentDelay}m` : '0 min'}
          </div>
          <div className="metric-sub-label">
            {currentDelay > 0 ? 'Behind Schedule' : 'Right Time'}
          </div>
        </div>

        {/* Next Halt & ETA */}
        <div className="telemetry-box eta-box">
          <div className="box-icon-label">
            <Navigation size={14} className="metric-icon" />
            <span>NEXT HALT</span>
          </div>
          <div className="metric-primary-value truncate-station">
            {nextStation}
          </div>
          <div className="metric-sub-label">
            ETA: {etaNext}
          </div>
        </div>
      </div>

      {/* Progress along journey */}
      <div className="journey-progress-container">
        <div className="progress-labels">
          <span className="curr-stn-label">
            <MapPin size={12} className="inline-icon" /> Current: <strong>{currentStation}</strong>
          </span>
          <span className="progress-pct-label">{progressPercent}% complete</span>
        </div>
        <div className="progress-track-bar">
          <div
            className="progress-fill-bar"
            style={{ width: `${Math.min(Math.max(progressPercent, 5), 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
