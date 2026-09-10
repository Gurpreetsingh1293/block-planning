import React, { useEffect } from "react";

/**
 * Maintenance Details Overlay Component
 * 
 * Displays comprehensive maintenance task details in a floating modal/overlay
 * when maintenance sections are selected.
 */

export default function STMaintenanceOverlay({ tasks, onClose, position = "center" }) {
  // Handle ESC key to close overlay
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!tasks || tasks.length === 0) {
    return null;
  }

  // Get urgency color
  const getUrgencyColor = (urgency) => {
    const colors = {
      low: "#00c851",
      medium: "#ffa500",
      high: "#ff3333",
      critical: "#8b0000"
    };
    return colors[urgency] || "#4a9eff";
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      clear: "#00c851",
      scheduled: "#4a9eff",
      inProgress: "#ffa500",
      overdue: "#ff3333",
      blocked: "#8b0000"
    };
    return colors[status] || "#4a9eff";
  };

  return (
    <div className="st-overlay-backdrop" onClick={onClose}>
      <div 
        className={`st-maintenance-overlay-container st-overlay-${position}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="st-overlay-header">
          <div className="st-overlay-header-content">
            <h2 className="st-overlay-title">
              📋 Maintenance Task Details
            </h2>
            <span className="st-overlay-count">
              {tasks.length} {tasks.length === 1 ? "Task" : "Tasks"} Selected
            </span>
          </div>
          <button 
            className="st-overlay-close"
            onClick={onClose}
            aria-label="Close overlay"
          >
            ✕
          </button>
        </div>

        <div className="st-overlay-body">
          {tasks.map((task, index) => (
            <div key={task.id} className="st-task-card">
              {/* Task Header */}
              <div className="st-task-header">
                <div className="st-task-header-left">
                  <span className="st-task-id">{task.id}</span>
                  <span 
                    className="st-task-urgency"
                    style={{ 
                      background: getUrgencyColor(task.urgency),
                      color: "#fff"
                    }}
                  >
                    {task.urgency.toUpperCase()}
                  </span>
                  <span 
                    className="st-task-status"
                    style={{ 
                      background: getStatusColor(task.status),
                      color: "#fff"
                    }}
                  >
                    {task.status.replace(/([A-Z])/g, ' $1').toUpperCase()}
                  </span>
                </div>
                <div className="st-task-type-badge">
                  {task.taskType.replace(/([A-Z])/g, ' $1').toUpperCase()}
                </div>
              </div>

              {/* Task Content */}
              <div className="st-task-content">
                {/* Asset Information */}
                <div className="st-task-section">
                  <h3 className="st-task-section-title">Asset & Location</h3>
                  <div className="st-task-info-grid">
                    <div className="st-task-info-item">
                      <span className="st-task-info-label">Asset:</span>
                      <span className="st-task-info-value">{task.asset}</span>
                    </div>
                    <div className="st-task-info-item">
                      <span className="st-task-info-label">Location:</span>
                      <span className="st-task-info-value">{task.location}</span>
                    </div>
                    <div className="st-task-info-item">
                      <span className="st-task-info-label">Station:</span>
                      <span className="st-task-info-value">{task.stationId}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {task.description && (
                  <div className="st-task-section">
                    <h3 className="st-task-section-title">Description</h3>
                    <p className="st-task-description">{task.description}</p>
                  </div>
                )}

                {/* Schedule & Resources */}
                <div className="st-task-section">
                  <h3 className="st-task-section-title">Schedule & Resources</h3>
                  <div className="st-task-info-grid">
                    <div className="st-task-info-item">
                      <span className="st-task-info-label">Duration:</span>
                      <span className="st-task-info-value">{task.requiredDuration}</span>
                    </div>
                    <div className="st-task-info-item">
                      <span className="st-task-info-label">Manpower:</span>
                      <span className="st-task-info-value">{task.manpower}</span>
                    </div>
                    <div className="st-task-info-item st-task-info-item--full">
                      <span className="st-task-info-label">Recommended Window:</span>
                      <span className="st-task-info-value st-task-window">
                        {task.recommendedWindow}
                      </span>
                    </div>
                    {task.estimatedCost && (
                      <div className="st-task-info-item">
                        <span className="st-task-info-label">Est. Cost:</span>
                        <span className="st-task-info-value st-task-cost">
                          {task.estimatedCost}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Maintenance History */}
                <div className="st-task-section">
                  <h3 className="st-task-section-title">Maintenance History</h3>
                  <div className="st-task-info-grid">
                    <div className="st-task-info-item">
                      <span className="st-task-info-label">Last Maintenance:</span>
                      <span className="st-task-info-value">{task.lastMaintenance}</span>
                    </div>
                    <div className="st-task-info-item">
                      <span className="st-task-info-label">Next Due:</span>
                      <span className="st-task-info-value">{task.nextDue}</span>
                    </div>
                    {task.overdueBy && (
                      <div className="st-task-info-item st-task-info-item--warning">
                        <span className="st-task-info-label">⚠️ Overdue By:</span>
                        <span className="st-task-info-value st-task-overdue">
                          {task.overdueBy}
                        </span>
                      </div>
                    )}
                    {task.workStarted && (
                      <div className="st-task-info-item st-task-info-item--active">
                        <span className="st-task-info-label">🔧 Work Started:</span>
                        <span className="st-task-info-value">{task.workStarted}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Block Requirements */}
                <div className="st-task-section">
                  <h3 className="st-task-section-title">Block Requirements</h3>
                  <div className="st-task-info-grid">
                    <div className="st-task-info-item st-task-info-item--full">
                      <span className="st-task-info-label">Affected Tracks:</span>
                      <span className="st-task-info-value">
                        {task.affectedTracks?.join(', ') || 'None'}
                      </span>
                    </div>
                    <div className="st-task-info-item st-task-info-item--full">
                      <span className="st-task-info-label">Block Path Elements:</span>
                      <div className="st-task-block-path">
                        {task.requiredBlockPath?.map((element) => (
                          <span key={element} className="st-task-block-element">
                            {element}
                          </span>
                        )) || 'None'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Blocked Reason (if applicable) */}
                {task.blockedReason && (
                  <div className="st-task-section st-task-section--alert">
                    <h3 className="st-task-section-title">🚫 Blocked</h3>
                    <p className="st-task-blocked-reason">{task.blockedReason}</p>
                  </div>
                )}
              </div>

              {/* Divider between tasks */}
              {index < tasks.length - 1 && <div className="st-task-divider" />}
            </div>
          ))}
        </div>

        <div className="st-overlay-footer">
          <button className="st-overlay-btn st-overlay-btn--secondary" onClick={onClose}>
            Close
          </button>
          <button className="st-overlay-btn st-overlay-btn--primary">
            View Full Schedule
          </button>
        </div>
      </div>
    </div>
  );
}
