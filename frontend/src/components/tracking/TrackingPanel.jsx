import React from 'react';
import StatusPill from '../common/StatusPill';
import { Train, Package, MapPin, Clock, Gauge, ArrowRight, Radio, Shield, CheckCircle2 } from 'lucide-react';

export default function TrackingPanel({ train, onClose }) {
  if (!train) {
    return (
      <div className="tracking-detail-panel empty-panel">
        <div className="empty-panel-content">
          <Train size={32} className="empty-icon text-muted" />
          <p className="empty-title">Select a train on the map</p>
          <span className="empty-desc">Click any active rake marker or list item to view real-time telemetry.</span>
        </div>
      </div>
    );
  }

  const isCargo = train.type === 'CARGO';

  return (
    <div className="tracking-detail-panel">
      {/* Panel Top Heading */}
      <div className="detail-panel-header">
        <div className="train-id-badge-wrap">
          {isCargo ? (
            <Package size={20} className="text-warning-amber" />
          ) : (
            <Train size={20} className="text-railway-blue" />
          )}
          <div>
            <h3 className="panel-train-number">
              {isCargo ? train.number : `TRAIN ${train.number}`}
            </h3>
            <span className="panel-train-name">{train.name}</span>
          </div>
        </div>

        <StatusPill status={train.status} />
      </div>

      {/* Main Movement Specs */}
      <div className="panel-telemetry-grid">
        <div className="telemetry-box current-loc">
          <div className="telemetry-label">
            <MapPin size={13} />
            <span>Current:</span>
          </div>
          <span className="telemetry-val">{train.currentStation}</span>
        </div>

        <div className="telemetry-box next-loc">
          <div className="telemetry-label">
            <ArrowRight size={13} />
            <span>Next:</span>
          </div>
          <span className="telemetry-val">{train.nextStation}</span>
        </div>

        <div className="telemetry-box status-loc">
          <div className="telemetry-label">
            <Radio size={13} />
            <span>Status:</span>
          </div>
          <span className="telemetry-val highlight-val">{train.status}</span>
        </div>

        <div className="telemetry-box eta-loc">
          <div className="telemetry-label">
            <Clock size={13} />
            <span>ETA:</span>
          </div>
          <span className="telemetry-val">{train.eta}</span>
        </div>
      </div>

      {/* Additional Operational Parameters */}
      <div className="panel-extra-info">
        <div className="extra-info-row">
          <span className="extra-key">Speed Telemetry</span>
          <span className="extra-val">{train.speed || '120 km/h'}</span>
        </div>

        <div className="extra-info-row">
          <span className="extra-key">Section Corridor</span>
          <span className="extra-val">{train.routeSection}</span>
        </div>

        <div className="extra-info-row">
          <span className="extra-key">Assigned Platform / Line</span>
          <span className="extra-val">{train.platform}</span>
        </div>

        {isCargo && (
          <>
            <div className="extra-info-row">
              <span className="extra-key">Gross Tonnage</span>
              <span className="extra-val">{train.tonnage}</span>
            </div>
            <div className="extra-info-row">
              <span className="extra-key">Wagon Count</span>
              <span className="extra-val">{train.wagons} Rakes</span>
            </div>
          </>
        )}

        <div className="extra-info-row timestamp-row">
          <span className="extra-key">Last updated:</span>
          <span className="extra-val">{train.lastUpdated}</span>
        </div>
      </div>

      {/* Intermediate Route Progress Timeline */}
      {train.stops && train.stops.length > 0 && (
        <div className="route-stops-timeline">
          <h4 className="stops-heading">Route Timeline</h4>
          <div className="stops-list">
            {train.stops.map((stop, idx) => (
              <div key={idx} className={`stop-node-item ${stop.status.toLowerCase()}`}>
                <div className="stop-marker-dot" />
                <div className="stop-info-line">
                  <span className="stop-station-name">{stop.station}</span>
                  <span className="stop-schedule-time">{stop.scheduled}</span>
                </div>
                <span className="stop-status-tag">{stop.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
