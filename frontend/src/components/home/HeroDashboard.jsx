import React from 'react';
import StatusPill from '../common/StatusPill';
import { Train, Calendar, AlertOctagon, Radio, Clock, Layers, ArrowUpRight } from 'lucide-react';

export default function HeroDashboard() {
  const nextTrains = [
    {
      number: '12002',
      name: 'Bhopal Shatabdi',
      time: '09:35',
      status: 'ON TIME',
      platform: 'PF 2'
    },
    {
      number: '12952',
      name: 'Mumbai Rajdhani',
      time: '10:05',
      status: 'ON TIME',
      platform: 'PF 4'
    },
    {
      number: '12310',
      name: 'Rajdhani Express',
      time: '10:30',
      status: 'DELAYED 12 MIN',
      platform: 'PF 3'
    }
  ];

  return (
    <div className="hero-dashboard-console">
      {/* Console Top Header Bar */}
      <div className="console-header-bar">
        <div className="console-brand-left">
          <div className="console-live-badge">
            <Radio size={13} className="badge-pulse" />
            <span>OPERATIONAL MONITOR</span>
          </div>
          <span className="console-title">RAILWAY OPERATIONS</span>
        </div>

        <div className="console-station-center">
          <span className="station-label">Station:</span>
          <span className="station-value">New Delhi</span>
        </div>

        <div className="console-date-right">
          <span className="date-tag">TODAY</span>
          <span className="date-display">SEPTEMBER 07, 2026</span>
        </div>
      </div>

      {/* Main Console Content Grid */}
      <div className="console-grid">
        {/* Next Trains Stream */}
        <div className="console-panel next-trains-panel">
          <div className="panel-header">
            <div className="panel-title-wrap">
              <Train size={15} className="panel-icon text-railway-blue" />
              <span className="panel-heading">NEXT TRAINS</span>
            </div>
            <span className="panel-counter">3 Movements</span>
          </div>

          <div className="trains-stream-list">
            {nextTrains.map((train) => (
              <div key={train.number} className="train-stream-row">
                <div className="train-id-box">
                  <span className="train-num">{train.number}</span>
                  <span className="train-divider">|</span>
                  <span className="train-title">{train.name}</span>
                </div>

                <div className="train-meta-box">
                  <div className="time-badge">
                    <Clock size={12} />
                    <span>{train.time}</span>
                  </div>
                  <StatusPill status={train.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Block Planning & Freight Activity Side Column */}
        <div className="console-side-column">
          {/* Block Planning Tile */}
          <div className="console-panel block-planning-tile">
            <div className="panel-header">
              <div className="panel-title-wrap">
                <Calendar size={15} className="panel-icon text-railway-blue" />
                <span className="panel-heading">BLOCK PLANNING</span>
              </div>
              <StatusPill status="OPTIMIZED" />
            </div>

            <div className="block-tile-body">
              <div className="tile-section-code">SECTION A-B</div>
              <div className="tile-time-range">10:00–12:00</div>
              <div className="tile-dept-combo">
                <span className="dept-badge-sm engg">ENGINEERING</span>
                <span className="dept-plus">+</span>
                <span className="dept-badge-sm snt">S&T</span>
              </div>
              <div className="tile-status-row">
                <span className="status-label">STATUS:</span>
                <span className="status-value-optimized">OPTIMIZED</span>
              </div>
            </div>
          </div>

          {/* Freight Activity Tile */}
          <div className="console-panel freight-activity-tile">
            <div className="panel-header">
              <div className="panel-title-wrap">
                <AlertOctagon size={15} className="panel-icon text-warning-amber" />
                <span className="panel-heading">FREIGHT ACTIVITY</span>
              </div>
              <span className="traffic-indicator-pill">HIGH TRAFFIC</span>
            </div>

            <div className="freight-tile-body">
              <div className="freight-time-highlight">11:00–12:30</div>
              <div className="freight-sub-note">
                Dedicated Coal Corridor transit • Priority cleared
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
