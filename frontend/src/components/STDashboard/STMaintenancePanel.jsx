import React from "react";

/**
 * Maintenance Status Side Panel Component
 * 
 * Displays maintenance task summary, upcoming tasks, and provides quick access
 * to maintenance sections by clicking on tasks.
 */

export default function STMaintenancePanel({ 
  tasks = [], 
  onTaskClick 
}) {
  // Calculate status counts
  const statusCounts = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {});

  // Get critical tasks (critical urgency or blocked status)
  const criticalTasks = tasks.filter(
    (task) => task.urgency === "critical" || task.status === "blocked"
  );

  // Get overdue tasks
  const overdueTasks = tasks.filter(
    (task) => task.status === "overdue" || task.overdueBy
  );

  // Get upcoming tasks (scheduled with high priority)
  const upcomingTasks = tasks
    .filter((task) => task.status === "scheduled" && task.urgency === "high")
    .slice(0, 5); // Limit to 5 most important

  // Get in-progress tasks
  const inProgressTasks = tasks.filter((task) => task.status === "inProgress");

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

  const getUrgencyIcon = (urgency) => {
    const icons = {
      low: "🟢",
      medium: "🟡",
      high: "🔴",
      critical: "🚨"
    };
    return icons[urgency] || "⚪";
  };

  return (
    <div className="st-maintenance-panel">
      {/* Summary Section */}
      <div className="st-panel-card">
        <h2 className="st-panel-title">Maintenance Summary</h2>
        
        <div className="st-maintenance-stats">
          <div className="st-maintenance-stat">
            <span className="st-maintenance-stat-value st-stat-scheduled">
              {statusCounts.scheduled || 0}
            </span>
            <span className="st-maintenance-stat-label">Scheduled</span>
          </div>
          
          <div className="st-maintenance-stat">
            <span className="st-maintenance-stat-value st-stat-inprogress">
              {statusCounts.inProgress || 0}
            </span>
            <span className="st-maintenance-stat-label">In Progress</span>
          </div>
          
          <div className="st-maintenance-stat">
            <span className="st-maintenance-stat-value st-stat-overdue">
              {statusCounts.overdue || 0}
            </span>
            <span className="st-maintenance-stat-label">Overdue</span>
          </div>
          
          <div className="st-maintenance-stat">
            <span className="st-maintenance-stat-value st-stat-blocked">
              {statusCounts.blocked || 0}
            </span>
            <span className="st-maintenance-stat-label">Blocked</span>
          </div>
        </div>

        <div className="st-maintenance-total">
          <span className="st-maintenance-total-label">Total Tasks:</span>
          <span className="st-maintenance-total-value">{tasks.length}</span>
        </div>
      </div>

      {/* Critical Tasks Section */}
      {criticalTasks.length > 0 && (
        <div className="st-panel-card st-panel-card--alert">
          <h2 className="st-panel-title">
            🚨 Critical Attention Required
          </h2>
          <ul className="st-maintenance-task-list">
            {criticalTasks.map((task) => (
              <li 
                key={task.id} 
                className="st-maintenance-task-item st-task-item--critical"
                onClick={() => onTaskClick?.(task)}
              >
                <div className="st-task-item-header">
                  <span className="st-task-item-id">{task.id}</span>
                  <span 
                    className="st-task-item-status"
                    style={{ background: getStatusColor(task.status) }}
                  >
                    {task.status.replace(/([A-Z])/g, ' $1').toUpperCase()}
                  </span>
                </div>
                <div className="st-task-item-info">
                  <span className="st-task-item-asset">{task.asset}</span>
                  <span className="st-task-item-location">{task.location}</span>
                </div>
                {task.blockedReason && (
                  <div className="st-task-item-reason">
                    🚫 {task.blockedReason}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Overdue Tasks Section */}
      {overdueTasks.length > 0 && (
        <div className="st-panel-card st-panel-card--warning">
          <h2 className="st-panel-title">
            ⚠️ Overdue Tasks
          </h2>
          <ul className="st-maintenance-task-list">
            {overdueTasks.map((task) => (
              <li 
                key={task.id} 
                className="st-maintenance-task-item st-task-item--overdue"
                onClick={() => onTaskClick?.(task)}
              >
                <div className="st-task-item-header">
                  <span className="st-task-item-id">{task.id}</span>
                  {task.overdueBy && (
                    <span className="st-task-item-overdue">
                      {task.overdueBy}
                    </span>
                  )}
                </div>
                <div className="st-task-item-info">
                  <span className="st-task-item-asset">{task.asset}</span>
                  <span className="st-task-item-location">{task.location}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* In Progress Tasks Section */}
      {inProgressTasks.length > 0 && (
        <div className="st-panel-card">
          <h2 className="st-panel-title">
            🔧 Currently In Progress
          </h2>
          <ul className="st-maintenance-task-list">
            {inProgressTasks.map((task) => (
              <li 
                key={task.id} 
                className="st-maintenance-task-item st-task-item--active"
                onClick={() => onTaskClick?.(task)}
              >
                <div className="st-task-item-header">
                  <span className="st-task-item-id">{task.id}</span>
                  <span className="st-task-item-urgency">
                    {getUrgencyIcon(task.urgency)}
                  </span>
                </div>
                <div className="st-task-item-info">
                  <span className="st-task-item-asset">{task.asset}</span>
                  <span className="st-task-item-location">{task.location}</span>
                </div>
                {task.workStarted && (
                  <div className="st-task-item-time">
                    Started: {task.workStarted}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Upcoming High Priority Tasks Section */}
      {upcomingTasks.length > 0 && (
        <div className="st-panel-card">
          <h2 className="st-panel-title">
            📅 Upcoming High Priority
          </h2>
          <ul className="st-maintenance-task-list">
            {upcomingTasks.map((task) => (
              <li 
                key={task.id} 
                className="st-maintenance-task-item"
                onClick={() => onTaskClick?.(task)}
              >
                <div className="st-task-item-header">
                  <span className="st-task-item-id">{task.id}</span>
                  <span className="st-task-item-urgency">
                    {getUrgencyIcon(task.urgency)}
                  </span>
                </div>
                <div className="st-task-item-info">
                  <span className="st-task-item-asset">{task.asset}</span>
                  <span className="st-task-item-location">{task.stationId}</span>
                </div>
                <div className="st-task-item-window">
                  {task.recommendedWindow}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Quick Stats */}
      <div className="st-panel-card st-panel-card--compact">
        <h2 className="st-panel-title">Quick Stats</h2>
        <div className="st-quick-stats">
          <div className="st-quick-stat-item">
            <span className="st-quick-stat-label">Avg. Duration:</span>
            <span className="st-quick-stat-value">3.5 hrs</span>
          </div>
          <div className="st-quick-stat-item">
            <span className="st-quick-stat-label">Total Manpower:</span>
            <span className="st-quick-stat-value">28 techs</span>
          </div>
          <div className="st-quick-stat-item">
            <span className="st-quick-stat-label">Block Windows:</span>
            <span className="st-quick-stat-value">{tasks.filter(t => t.status === 'scheduled').length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
