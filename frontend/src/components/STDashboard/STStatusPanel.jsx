import React from "react";

export default function STStatusPanel({ status, alerts }) {
  return (
    <div className="st-status-panel">
      <div className="st-panel-card">
        <h2 className="st-panel-title">S&amp;T Status</h2>
        <ul className="st-status-list">
          {status.map((item) => (
            <li key={item.label} className="st-status-row">
              <span className="st-status-label">{item.label}</span>
              <span className="st-status-value">
                <span className={`st-status-dot st-status-dot--${item.level}`} />
                {item.value}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="st-panel-card">
        <h2 className="st-panel-title">Alerts</h2>
        <ul className="st-alert-list">
          {alerts.map((alert) => (
            <li key={alert.id} className={`st-alert-item st-alert-item--${alert.level}`}>
              <span className="st-alert-title">{alert.title}</span>
              <span className="st-alert-tag">{alert.detail || alert.level}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}