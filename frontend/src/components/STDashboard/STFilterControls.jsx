import React, { useState } from "react";

/**
 * Filter Controls Component
 * 
 * Provides filtering controls for maintenance tasks by station, status, 
 * task type, and date range.
 */

export default function STFilterControls({ 
  stations = [], 
  onFilterChange,
  initialFilters = {}
}) {
  const [filters, setFilters] = useState({
    station: initialFilters.station || "all",
    status: initialFilters.status || [],
    taskType: initialFilters.taskType || [],
    dateRange: initialFilters.dateRange || "all"
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const statusOptions = [
    { value: "scheduled", label: "Scheduled", color: "#4a9eff" },
    { value: "inProgress", label: "In Progress", color: "#ffa500" },
    { value: "overdue", label: "Overdue", color: "#ff3333" },
    { value: "blocked", label: "Blocked", color: "#8b0000" }
  ];

  const taskTypeOptions = [
    { value: "signal", label: "Signal Maintenance", icon: "🚦" },
    { value: "track", label: "Track Circuit", icon: "⚡" },
    { value: "point", label: "Point Machine", icon: "⚙️" },
    { value: "telecom", label: "Telecommunication", icon: "📡" },
    { value: "electrical", label: "Electrical Systems", icon: "⚡" },
    { value: "interlocking", label: "Interlocking", icon: "🔒" }
  ];

  const dateRangeOptions = [
    { value: "all", label: "All Dates" },
    { value: "today", label: "Today" },
    { value: "tomorrow", label: "Tomorrow" },
    { value: "next7days", label: "Next 7 Days" },
    { value: "next30days", label: "Next 30 Days" }
  ];

  const handleStationChange = (e) => {
    const newFilters = { ...filters, station: e.target.value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleStatusToggle = (status) => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter((s) => s !== status)
      : [...filters.status, status];
    
    const newFilters = { ...filters, status: newStatus };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleTaskTypeToggle = (type) => {
    const newTypes = filters.taskType.includes(type)
      ? filters.taskType.filter((t) => t !== type)
      : [...filters.taskType, type];
    
    const newFilters = { ...filters, taskType: newTypes };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleDateRangeChange = (e) => {
    const newFilters = { ...filters, dateRange: e.target.value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      station: "all",
      status: [],
      taskType: [],
      dateRange: "all"
    };
    setFilters(resetFilters);
    onFilterChange?.(resetFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.station !== "all") count++;
    if (filters.status.length > 0) count += filters.status.length;
    if (filters.taskType.length > 0) count += filters.taskType.length;
    if (filters.dateRange !== "all") count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="st-filter-controls">
      <div className="st-filter-header">
        <button 
          className="st-filter-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className="st-filter-toggle-icon">{isExpanded ? "▼" : "▶"}</span>
          <span className="st-filter-toggle-label">
            🔍 Filters
            {activeFilterCount > 0 && (
              <span className="st-filter-count">{activeFilterCount}</span>
            )}
          </span>
        </button>
        
        {/* Always render button space to prevent layout shift */}
        {activeFilterCount > 0 ? (
          <button className="st-filter-reset" onClick={handleReset}>
            Reset All
          </button>
        ) : (
          <div style={{ minWidth: '80px' }} /> 
        )}
      </div>

      {isExpanded && (
        <div className="st-filter-body">
          {/* Station Filter */}
          <div className="st-filter-section">
            <label className="st-filter-label">Station / Section</label>
            <select 
              className="st-filter-select"
              value={filters.station}
              onChange={handleStationChange}
            >
              <option value="all">All Stations</option>
              {stations.map((station) => (
                <option key={station.id} value={station.id}>
                  {station.name} ({station.code})
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="st-filter-section">
            <label className="st-filter-label">Maintenance Status</label>
            <div className="st-filter-checkbox-group">
              {statusOptions.map((option) => (
                <label 
                  key={option.value} 
                  className={`st-filter-checkbox ${
                    filters.status.includes(option.value) ? "st-filter-checkbox--checked" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={filters.status.includes(option.value)}
                    onChange={() => handleStatusToggle(option.value)}
                  />
                  <span 
                    className="st-filter-checkbox-indicator"
                    style={{ background: option.color }}
                  />
                  <span className="st-filter-checkbox-label">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Task Type Filter */}
          <div className="st-filter-section">
            <label className="st-filter-label">Task Type</label>
            <div className="st-filter-checkbox-group">
              {taskTypeOptions.map((option) => (
                <label 
                  key={option.value} 
                  className={`st-filter-checkbox ${
                    filters.taskType.includes(option.value) ? "st-filter-checkbox--checked" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={filters.taskType.includes(option.value)}
                    onChange={() => handleTaskTypeToggle(option.value)}
                  />
                  <span className="st-filter-checkbox-indicator">
                    {option.icon}
                  </span>
                  <span className="st-filter-checkbox-label">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="st-filter-section">
            <label className="st-filter-label">Date Range</label>
            <select 
              className="st-filter-select"
              value={filters.dateRange}
              onChange={handleDateRangeChange}
            >
              {dateRangeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Summary */}
          {activeFilterCount > 0 && (
            <div className="st-filter-summary">
              <span className="st-filter-summary-label">Active Filters:</span>
              <div className="st-filter-summary-tags">
                {filters.station !== "all" && (
                  <span className="st-filter-tag">
                    Station: {stations.find(s => s.id === filters.station)?.code || filters.station}
                  </span>
                )}
                {filters.status.map((status) => (
                  <span key={status} className="st-filter-tag">
                    {statusOptions.find(s => s.value === status)?.label}
                  </span>
                ))}
                {filters.taskType.map((type) => (
                  <span key={type} className="st-filter-tag">
                    {taskTypeOptions.find(t => t.value === type)?.label}
                  </span>
                ))}
                {filters.dateRange !== "all" && (
                  <span className="st-filter-tag">
                    {dateRangeOptions.find(d => d.value === filters.dateRange)?.label}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
