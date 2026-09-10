import React from 'react';
import StatusPill from '../common/StatusPill';
import { Train, Clock, Radio, AlertOctagon, Wrench, Sparkles, Navigation, CheckCircle2 } from 'lucide-react';

export default function FloatingCard({
  type = 'default', // 'block-optimized' | 'freight-alert' | 'maintenance' | 'live-status' | 'ai-rec' | 'live-tracking-card' | 'timetable-card'
  className = ''
}) {
  if (type === 'block-optimized') {
    return (
      <div className={`floating-control-card floating-card-optimized ${className}`}>
        <div className="card-top-indicator">
          <div className="card-tag-with-icon">
            <CheckCircle2 size={13} className="text-accent-teal" />
            <span className="card-label-tag">BLOCK OPTIMIZED</span>
          </div>
          <StatusPill status="OPTIMIZED" />
        </div>
        <div className="card-section-name">Section A-B</div>
        <div className="card-time-span">10:00–12:00</div>
        <div className="card-sub-detail">3 tasks coordinated</div>
      </div>
    );
  }

  if (type === 'freight-alert') {
    return (
      <div className={`floating-control-card floating-card-alert ${className}`}>
        <div className="card-top-indicator">
          <div className="card-tag-with-icon">
            <AlertOctagon size={13} className="text-accent-red" />
            <span className="card-label-tag alert-tag">FREIGHT ALERT</span>
          </div>
          <span className="alert-pill-mini">High Traffic</span>
        </div>
        <div className="card-primary-title">High freight movement detected</div>
        <div className="card-time-span">11:00–12:30</div>
      </div>
    );
  }

  if (type === 'maintenance') {
    return (
      <div className={`floating-control-card floating-card-dept ${className}`}>
        <div className="card-top-indicator">
          <div className="card-tag-with-icon">
            <Wrench size={13} className="text-railway-blue" />
            <span className="card-label-tag">MAINTENANCE</span>
          </div>
          <span className="dept-count-badge">3 Compatible</span>
        </div>
        <div className="dept-tags-row">
          <span className="dept-tag dept-eng">Engineering</span>
          <span className="dept-tag dept-snt">S&T</span>
          <span className="dept-tag dept-trd">TRD</span>
        </div>
        <div className="card-sub-detail">3 compatible tasks</div>
      </div>
    );
  }

  if (type === 'live-status') {
    return (
      <div className={`floating-control-card floating-card-status ${className}`}>
        <div className="card-top-indicator">
          <div className="card-tag-with-icon">
            <Radio size={13} className="text-signal-green" />
            <span className="card-label-tag">LIVE STATUS</span>
          </div>
          <span className="live-pulse-dot" />
        </div>
        <div className="status-hero-number">124 trains monitored</div>
        <div className="status-breakdown-row">
          <span className="status-on-time">118 ON TIME</span>
          <span className="status-divider">•</span>
          <span className="status-delayed">6 DELAYED</span>
        </div>
      </div>
    );
  }

  if (type === 'ai-rec') {
    return (
      <div className={`floating-control-card floating-card-ai ${className}`}>
        <div className="card-top-indicator">
          <div className="card-tag-with-icon">
            <Sparkles size={13} className="text-accent-teal" />
            <span className="card-label-tag ai-tag">AI RECOMMENDATION</span>
          </div>
          <span className="ai-tag-chip">Lower Conflict</span>
        </div>
        <div className="ai-rec-action">
          <span className="ai-rec-prefix">Move block to:</span>
          <span className="ai-rec-time">13:00–15:00</span>
        </div>
        <div className="ai-rec-reason">
          <strong>Reason:</strong> Lower freight conflict
        </div>
      </div>
    );
  }

  if (type === 'live-tracking-card') {
    return (
      <div className={`floating-control-card floating-card-tracking ${className}`}>
        <div className="card-top-indicator">
          <div className="card-tag-with-icon">
            <Navigation size={13} className="text-railway-blue" />
            <span className="card-label-tag">LIVE TRACKING</span>
          </div>
          <StatusPill status="ON TIME" />
        </div>
        <div className="mini-tracking-train">
          <span className="train-id-bold">12002</span>
          <span className="train-name-light">Bhopal Shatabdi</span>
        </div>
        <div className="mini-route-progress">
          <span className="route-node">Agra Cantt</span>
          <span className="route-arrow">→</span>
          <span className="route-node active-node">New Delhi</span>
        </div>
        <div className="card-sub-detail">Speed: 128 km/h • ETA: 10:05</div>
      </div>
    );
  }

  if (type === 'timetable-card') {
    return (
      <div className={`floating-control-card floating-card-timetable ${className}`}>
        <div className="card-top-indicator">
          <div className="card-tag-with-icon">
            <Clock size={13} className="text-railway-blue" />
            <span className="card-label-tag">TIMETABLE</span>
          </div>
          <span className="station-mini-tag">NDLS</span>
        </div>
        <div className="mini-timetable-row">
          <span className="tt-time">10:05</span>
          <span className="tt-train">12952 Mumbai Rajdhani</span>
          <span className="tt-pf">PF 4</span>
        </div>
        <div className="mini-timetable-row delayed">
          <span className="tt-time">10:30</span>
          <span className="tt-train">12310 Rajdhani Exp</span>
          <span className="tt-delay">+12m</span>
        </div>
      </div>
    );
  }

  return null;
}
