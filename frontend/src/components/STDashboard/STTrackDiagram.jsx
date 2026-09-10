import React, { useMemo, useState } from "react";
import STMaintenanceOverlay from "./STMaintenanceOverlay";

// Small helpers -------------------------------------------------------------

function cloneById(list) {
  return list.map((item) => ({ ...item }));
}

function findRoute(routes, a, b) {
  return routes.find(
    (r) => (r.from === a && r.to === b) || (r.from === b && r.to === a)
  );
}

// Component -------------------------------------------------------------------

export default function STTrackDiagram({ 
  tracks, 
  points, 
  signals, 
  sections, 
  trains, 
  routes,
  stations = [],
  stationInfrastructure = [],
  trackCircuits = [],
  trackSections = [],
  maintenanceTasks = [],
  maintenanceStatusColors = {}
}) {
  const [pointStates, setPointStates] = useState(() => cloneById(points));
  const [signalStates, setSignalStates] = useState(() => cloneById(signals));
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedPoints, setSelectedPoints] = useState([]);
  const [activeRoute, setActiveRoute] = useState(null);
  const [message, setMessage] = useState("");
  const [hoveredMaintenance, setHoveredMaintenance] = useState(null);
  
  // Maintenance section selection
  const [maintenanceSelectionMode, setMaintenanceSelectionMode] = useState(false);
  const [selectedMaintenanceSections, setSelectedMaintenanceSections] = useState([]);
  const [showMaintenanceOverlay, setShowMaintenanceOverlay] = useState(false);

  // Create a map of track section IDs to their maintenance status
  const maintenanceStatusMap = useMemo(() => {
    const map = {};
    maintenanceTasks.forEach(task => {
      if (task.trackSectionId) {
        map[task.trackSectionId] = {
          status: task.status,
          task: task
        };
      }
    });
    return map;
  }, [maintenanceTasks]);

  const pointById = useMemo(() => {
    const map = {};
    pointStates.forEach((p) => (map[p.id] = p));
    return map;
  }, [pointStates]);

  function toggleSelectionMode() {
    setSelectionMode((prev) => !prev);
    setSelectedPoints([]);
    setMessage("");
  }

  function handlePointClick(id) {
    const point = pointById[id];

    if (!selectionMode) {
      setMessage(`${id} — ${point.position}${point.locked ? " · LOCKED" : ""}`);
      return;
    }

    if (point.locked) {
      setMessage(`Point ${id} is locked while the route is active.`);
      return;
    }

    setSelectedPoints((prev) => {
      if (prev.includes(id)) {
        return prev.filter((p) => p !== id);
      }
      if (prev.length >= 2) {
        setMessage("Only two points can be selected at a time.");
        return prev;
      }
      setMessage("");
      return [...prev, id];
    });
  }

  function handleSignalClick(id) {
    const signal = signalStates.find((s) => s.id === id);
    setMessage(`${id} — ${signal.aspect}`);
  }

  function handleMaintenanceSectionHover(sectionId, task) {
    if (task) {
      setHoveredMaintenance(sectionId);
      setMessage(
        `${task.asset} — ${task.taskType.toUpperCase()} — ${task.status.toUpperCase()} — ${task.urgency.toUpperCase()} priority`
      );
    }
  }

  function handleMaintenanceSectionLeave() {
    setHoveredMaintenance(null);
    setMessage("");
  }

  function toggleMaintenanceSelectionMode() {
    setMaintenanceSelectionMode((prev) => !prev);
    setSelectedMaintenanceSections([]);
    setMessage("");
  }

  function handleMaintenanceSectionClick(sectionId, task) {
    if (!maintenanceSelectionMode) {
      // If not in selection mode, just show info
      setMessage(
        `${task.asset} — ${task.description || 'No description'} — Duration: ${task.requiredDuration}`
      );
      return;
    }

    // Toggle selection
    setSelectedMaintenanceSections((prev) => {
      if (prev.includes(sectionId)) {
        const newSelection = prev.filter((id) => id !== sectionId);
        if (newSelection.length === 0) {
          setMessage("No maintenance sections selected");
        } else {
          setMessage(`${newSelection.length} maintenance section(s) selected`);
        }
        return newSelection;
      } else {
        const newSelection = [...prev, sectionId];
        setMessage(`${newSelection.length} maintenance section(s) selected`);
        return newSelection;
      }
    });
  }

  function clearMaintenanceSelection() {
    setSelectedMaintenanceSections([]);
    setMessage("Selection cleared");
  }

  // Get selected maintenance tasks
  const selectedMaintenanceTasks = useMemo(() => {
    return selectedMaintenanceSections
      .map((sectionId) => maintenanceStatusMap[sectionId]?.task)
      .filter(Boolean);
  }, [selectedMaintenanceSections, maintenanceStatusMap]);

  // Calculate combined block path from selected maintenance tasks
  const combinedBlockPath = useMemo(() => {
    if (selectedMaintenanceTasks.length === 0) return [];
    
    // Collect all block path elements from selected tasks
    const allBlockElements = selectedMaintenanceTasks.flatMap(
      (task) => task.requiredBlockPath || []
    );
    
    // Remove duplicates
    return [...new Set(allBlockElements)];
  }, [selectedMaintenanceTasks]);

  // Get affected tracks from selected maintenance tasks
  const affectedTracks = useMemo(() => {
    if (selectedMaintenanceTasks.length === 0) return [];
    
    const allTracks = selectedMaintenanceTasks.flatMap(
      (task) => task.affectedTracks || []
    );
    
    return [...new Set(allTracks)];
  }, [selectedMaintenanceTasks]);

  function handleSetRoute() {
    if (selectedPoints.length !== 2) return;

    const [a, b] = selectedPoints;
    const route = findRoute(routes, a, b);

    if (!route) {
      setMessage(`No valid demo route between ${a} and ${b}.`);
      return;
    }

    setPointStates((prev) =>
      prev.map((p) => {
        const required = route.requiredPositions[p.id];
        if (!required) return p;
        return { ...p, position: required, locked: true };
      })
    );

    setSignalStates((prev) =>
      prev.map((s) => (s.id === route.signal ? { ...s, aspect: "GREEN" } : s))
    );

    setActiveRoute(route);
    setSelectedPoints([]);
    setMessage("");
  }

  function handleClearRoute() {
    if (!activeRoute) return;

    setPointStates((prev) =>
      prev.map((p) =>
        activeRoute.requiredPositions[p.id] ? { ...p, locked: false } : p
      )
    );
    setSignalStates((prev) =>
      prev.map((s) => (s.id === activeRoute.signal ? { ...s, aspect: "RED" } : s))
    );
    setActiveRoute(null);
    setMessage("Route cleared.");
  }

  const sectionState = (id) => sections.find((s) => s.id === id)?.state || "CLEAR";
  
  // Determine corridor name and subtitle
  const corridorName = stations.length > 1 
    ? `${stations[0]?.name || "Delhi"} - ${stations[stations.length - 1]?.name || "Mumbai"} Corridor`
    : "Railway Signalling Schematic";
  
  const corridorSubtitle = stations.length > 1
    ? `${stations.length} stations · ${stations[0]?.code || "NDLS"} to ${stations[stations.length - 1]?.code || "MMCT"}`
    : "Gullaguda station area";

  return (
    <div className="st-diagram-card">
      <div className="st-diagram-toolbar">
        <div className="st-diagram-toolbar-left">
          <h2 className="st-panel-title">{corridorName}</h2>
          <span className="st-panel-subtitle">{corridorSubtitle}</span>
        </div>

        <div className="st-diagram-toolbar-right">
          {/* Maintenance Selection Controls */}
          <button
            type="button"
            className={`st-btn ${maintenanceSelectionMode ? "st-btn--active" : ""}`}
            onClick={toggleMaintenanceSelectionMode}
          >
            Select Maintenance
          </button>
          {maintenanceSelectionMode && selectedMaintenanceSections.length > 0 && (
            <>
              <button 
                type="button" 
                className="st-btn st-btn--primary" 
                onClick={() => setShowMaintenanceOverlay(true)}
              >
                View Details ({selectedMaintenanceSections.length})
              </button>
              <button 
                type="button" 
                className="st-btn st-btn--ghost" 
                onClick={clearMaintenanceSelection}
              >
                Clear
              </button>
            </>
          )}
          
          {/* Divider */}
          {maintenanceSelectionMode && <div className="st-toolbar-divider" />}
          
          {/* Point Selection Controls */}
          <button
            type="button"
            className={`st-btn ${selectionMode ? "st-btn--active" : ""}`}
            onClick={toggleSelectionMode}
          >
            Select Points
          </button>
          <button
            type="button"
            className="st-btn st-btn--primary"
            disabled={selectedPoints.length !== 2}
            onClick={handleSetRoute}
          >
            Set Route
          </button>
          {activeRoute && (
            <button type="button" className="st-btn st-btn--ghost" onClick={handleClearRoute}>
              Clear Route
            </button>
          )}
        </div>
      </div>

      {/* Maintenance Selection Panel */}
      {maintenanceSelectionMode && (
        <div className="st-selection-panel st-maintenance-selection-panel">
          <span className="st-selection-label">Selected Maintenance Tasks:</span>
          {selectedMaintenanceSections.length === 0 && (
            <span className="st-selection-empty">None — Click on maintenance sections to select</span>
          )}
          {selectedMaintenanceTasks.map((task) => (
            <span key={task.id} className="st-selected-chip st-maintenance-chip">
              {task.asset} ({task.taskType})
            </span>
          ))}
        </div>
      )}

      {/* Block Path Information Panel */}
      {combinedBlockPath.length > 0 && (
        <div className="st-block-path-panel">
          <span className="st-block-path-title">
            🔒 REQUIRED BLOCK PATH
          </span>
          <div className="st-block-path-details">
            <span className="st-block-path-label">Affected Points:</span>
            <span className="st-block-path-value">
              {combinedBlockPath.filter(id => id.startsWith('P')).join(', ') || 'None'}
            </span>
          </div>
          <div className="st-block-path-details">
            <span className="st-block-path-label">Affected Signals:</span>
            <span className="st-block-path-value">
              {combinedBlockPath.filter(id => id.startsWith('S')).join(', ') || 'None'}
            </span>
          </div>
          <div className="st-block-path-details">
            <span className="st-block-path-label">Affected Tracks:</span>
            <span className="st-block-path-value">
              {affectedTracks.join(', ') || 'None'}
            </span>
          </div>
          <div className="st-block-path-details">
            <span className="st-block-path-label">Total Elements:</span>
            <span className="st-block-path-value st-block-path-count">
              {combinedBlockPath.length}
            </span>
          </div>
        </div>
      )}

      {selectionMode && (
        <div className="st-selection-panel">
          <span className="st-selection-label">Selected Points:</span>
          {selectedPoints.length === 0 && <span className="st-selection-empty">None</span>}
          {selectedPoints.map((id) => (
            <span key={id} className="st-selected-chip">
              {id}
            </span>
          ))}
        </div>
      )}

      {activeRoute && (
        <div className="st-route-status st-route-status--locked">
          <span className="st-route-status-title">ROUTE SET</span>
          <span className="st-route-status-path">
            {activeRoute.from} → {activeRoute.to}
          </span>
          <span className="st-route-status-tag">STATUS: LOCKED</span>
        </div>
      )}

      {/* Always render message div to prevent layout shift */}
      <div className="st-message">{message}</div>

      <div className="st-svg-wrap">
        <svg viewBox="0 0 3600 600" className="st-svg" xmlns="http://www.w3.org/2000/svg">
          
          {/* SVG Filters for realistic effects */}
          <defs>
            <filter id="signal-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            
            <filter id="drop-shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="1" />
              <feOffset dx="0" dy="1" result="offsetblur" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.3" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          {/* Kilometer markers along the track */}
          {stations.map((station, idx) => (
            <g key={`km-${station.id}`} className="st-km-marker-group">
              <line 
                x1={station.x} 
                y1={560} 
                x2={station.x} 
                y2={570} 
                stroke="#666" 
                strokeWidth="2" 
              />
              <text 
                x={station.x} 
                y={585} 
                textAnchor="middle" 
                className="st-km-label"
                style={{ fontSize: '11px', fontFamily: 'Courier New, monospace', fill: '#888', fontWeight: '600' }}
              >
                KM {station.kmPosition}
              </text>
            </g>
          ))}

          {/* Direction indicators (UP/DN) */}
          <g className="st-direction-indicators">
            {/* UP Direction (Left to Right) */}
            <g transform="translate(100, 220)">
              <polygon 
                points="0,0 12,6 0,12" 
                fill="#4a9eff" 
                opacity="0.8"
              />
              <text 
                x="18" 
                y="10" 
                className="st-direction-label"
                style={{ fontSize: '10px', fontFamily: 'Arial, sans-serif', fill: '#4a9eff', fontWeight: '700' }}
              >
                UP LINE
              </text>
            </g>
            
            {/* DN Direction (Right to Left) */}
            <g transform="translate(100, 380)">
              <polygon 
                points="12,0 0,6 12,12" 
                fill="#ffa500" 
                opacity="0.8"
              />
              <text 
                x="18" 
                y="10" 
                className="st-direction-label"
                style={{ fontSize: '10px', fontFamily: 'Arial, sans-serif', fill: '#ffa500', fontWeight: '700' }}
              >
                DN LINE
              </text>
            </g>
          </g>

          {/* Station buildings and infrastructure */}
          {stationInfrastructure.map((infra) => {
            const station = stations.find(s => s.id === infra.stationId);
            return (
              <g key={infra.stationId} className="st-station-group">
                {/* Station building */}
                <rect 
                  x={infra.building.x} 
                  y={infra.building.y} 
                  width={infra.building.width} 
                  height={infra.building.height} 
                  rx="4" 
                  className="st-station-box" 
                />
                <text 
                  x={infra.building.x + infra.building.width / 2} 
                  y={infra.building.y - 8} 
                  textAnchor="middle" 
                  className="st-station-label"
                >
                  {infra.building.label}
                </text>
                <text 
                  x={infra.building.x + infra.building.width / 2} 
                  y={infra.building.y + infra.building.height / 2 + 5} 
                  textAnchor="middle" 
                  className="st-station-code"
                >
                  {station?.code || ""} · Km {station?.kmPosition || 0}
                </text>
                
                {/* Platforms */}
                {infra.platforms.map((platform) => (
                  <g key={platform.id}>
                    <rect
                      x={platform.x}
                      y={platform.y}
                      width={platform.width}
                      height={platform.height}
                      rx="2"
                      className="st-platform"
                    />
                    {/* Platform edge markings (yellow safety line) */}
                    <line 
                      x1={platform.x + 2} 
                      y1={platform.y + platform.height} 
                      x2={platform.x + platform.width - 2} 
                      y2={platform.y + platform.height} 
                      stroke="#ffd700" 
                      strokeWidth="3" 
                      strokeDasharray="8,4"
                      opacity="0.9"
                    />
                    {/* Platform label */}
                    <text 
                      x={platform.x + platform.width / 2} 
                      y={platform.y + platform.height / 2} 
                      textAnchor="middle" 
                      dominantBaseline="middle"
                      className="st-platform-label"
                      style={{ fontSize: '9px', fill: '#333', fontWeight: '600', fontFamily: 'Arial, sans-serif' }}
                    >
                      {platform.id}
                    </text>
                  </g>
                ))}
              </g>
            );
          })}

          {/* main tracks */}
          {tracks.map((t) => (
            <g key={t.id}>
              <line x1={t.x1} y1={t.y} x2={t.x2} y2={t.y} className="st-track-line" />
              <text x={20} y={t.y + 4} textAnchor="start" className="st-track-label">
                {t.label}
              </text>
              <text x={3580} y={t.y + 4} textAnchor="end" className="st-track-label">
                {t.label}
              </text>
            </g>
          ))}

          {/* maintenance section highlighting */}
          {trackSections.map((section) => {
            const maintenanceInfo = maintenanceStatusMap[section.id];
            if (!maintenanceInfo || maintenanceInfo.status === 'clear') {
              return null; // Don't highlight clear sections
            }
            
            const statusColor = maintenanceStatusColors[maintenanceInfo.status] || {};
            const heightOffset = section.track === 'DN_MAIN' ? -25 : 25;
            const isHovered = hoveredMaintenance === section.id;
            const isSelected = selectedMaintenanceSections.includes(section.id);
            
            return (
              <g 
                key={`maint-${section.id}`} 
                className={`st-maintenance-section ${maintenanceSelectionMode ? 'st-maintenance-section--selectable' : ''} ${isSelected ? 'st-maintenance-section--selected' : ''}`}
                onMouseEnter={() => handleMaintenanceSectionHover(section.id, maintenanceInfo.task)}
                onMouseLeave={handleMaintenanceSectionLeave}
                onClick={() => handleMaintenanceSectionClick(section.id, maintenanceInfo.task)}
              >
                {/* Semi-transparent overlay on track section */}
                <rect
                  x={section.x1}
                  y={section.y + heightOffset - 15}
                  width={section.x2 - section.x1}
                  height={30}
                  fill={isSelected ? statusColor.stroke : (statusColor.fill || 'rgba(74, 158, 255, 0.15)')}
                  fillOpacity={isSelected ? 0.3 : 1}
                  stroke={statusColor.stroke || '#4a9eff'}
                  strokeWidth={isSelected ? "4" : (isHovered ? "3" : "2")}
                  strokeDasharray={isSelected ? "none" : "5 5"}
                  rx="4"
                  className="st-maintenance-overlay"
                  style={{
                    filter: (isHovered || isSelected) ? `drop-shadow(0 0 10px ${statusColor.stroke})` : 'none'
                  }}
                />
                
                {/* Selection indicator */}
                {isSelected && (
                  <circle
                    cx={section.x1 + 15}
                    cy={section.y + heightOffset}
                    r="8"
                    fill={statusColor.stroke}
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="st-maintenance-check"
                  />
                )}
                {isSelected && (
                  <text
                    x={section.x1 + 15}
                    y={section.y + heightOffset + 5}
                    textAnchor="middle"
                    className="st-maintenance-check-mark"
                    fill="#ffffff"
                    fontSize="12"
                    fontWeight="bold"
                  >
                    ✓
                  </text>
                )}
                
                {/* Status label */}
                <text
                  x={(section.x1 + section.x2) / 2}
                  y={section.y + heightOffset - 20}
                  textAnchor="middle"
                  className="st-maintenance-label"
                  fill={statusColor.stroke || '#4a9eff'}
                >
                  {maintenanceInfo.task.asset || 'MAINTENANCE'}
                </text>
                
                {/* Status indicator */}
                <text
                  x={(section.x1 + section.x2) / 2}
                  y={section.y + heightOffset + 20}
                  textAnchor="middle"
                  className="st-maintenance-status"
                  fill={statusColor.stroke || '#4a9eff'}
                >
                  {statusColor.label || maintenanceInfo.status.toUpperCase()}
                </text>
              </g>
            );
          })}

          {/* active route highlight */}
          {activeRoute && (
            <polyline
              points={activeRoute.highlight.map((p) => `${p.x},${p.y}`).join(" ")}
              className="st-route-highlight"
            />
          )}

          {/* Combined block path highlighting for selected maintenance tasks */}
          {combinedBlockPath.length > 0 && (
            <g className="st-block-path-group">
              {/* Highlight affected points */}
              {pointStates
                .filter((p) => combinedBlockPath.includes(p.id))
                .map((p) => (
                  <g key={`block-point-${p.id}`}>
                    <circle
                      cx={p.track1.x}
                      cy={p.track1.y}
                      r="14"
                      fill="none"
                      stroke="var(--st-cyan-bright)"
                      strokeWidth="3"
                      strokeDasharray="4 4"
                      className="st-block-path-indicator"
                    />
                    <circle
                      cx={p.track1.x}
                      cy={p.track1.y}
                      r="18"
                      fill="none"
                      stroke="var(--st-cyan-bright)"
                      strokeWidth="1"
                      opacity="0.5"
                      className="st-block-path-outer"
                    />
                  </g>
                ))}
              
              {/* Highlight affected signals */}
              {signalStates
                .filter((s) => combinedBlockPath.includes(s.id))
                .map((s) => (
                  <g key={`block-signal-${s.id}`}>
                    <rect
                      x={s.x - 12}
                      y={s.y - 45}
                      width="24"
                      height="50"
                      rx="4"
                      fill="none"
                      stroke="var(--st-cyan-bright)"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      className="st-block-path-indicator"
                    />
                  </g>
                ))}
              
              {/* Draw connecting lines for block path on affected tracks */}
              {affectedTracks.map((trackId) => {
                const track = tracks.find((t) => t.id === trackId);
                if (!track) return null;
                
                // Find all sections on this track that are selected
                const affectedSections = trackSections.filter(
                  (section) => 
                    section.track === trackId && 
                    selectedMaintenanceSections.includes(section.id)
                );
                
                if (affectedSections.length === 0) return null;
                
                // Get min and max x coordinates
                const minX = Math.min(...affectedSections.map((s) => s.x1));
                const maxX = Math.max(...affectedSections.map((s) => s.x2));
                
                return (
                  <line
                    key={`block-track-${trackId}`}
                    x1={minX}
                    y1={track.y}
                    x2={maxX}
                    y2={track.y}
                    stroke="var(--st-cyan-bright)"
                    strokeWidth="8"
                    strokeDasharray="8 8"
                    strokeLinecap="round"
                    opacity="0.6"
                    className="st-block-path-track"
                  />
                );
              })}
            </g>
          )}

          {/* points */}
          {pointStates.map((p) => {
            const isSelected = selectedPoints.includes(p.id);
            const isReverse = p.position === "REVERSE";
            const isInBlockPath = combinedBlockPath.includes(p.id);
            return (
              <g
                key={p.id}
                className={`st-point-group ${selectionMode ? "st-point-group--selectable" : ""} ${isInBlockPath ? "st-point-in-block-path" : ""}`}
                onClick={() => handlePointClick(p.id)}
              >
                <line
                  x1={p.track1.x}
                  y1={p.track1.y}
                  x2={p.track2.x}
                  y2={p.track2.y}
                  className={`st-point-blade ${isReverse ? "st-point-blade--reverse" : "st-point-blade--normal"}`}
                />
                <circle
                  cx={p.track1.x}
                  cy={p.track1.y}
                  r={isSelected ? 9 : 6}
                  className={`st-point-marker ${isSelected ? "st-point-marker--selected" : ""} ${
                    p.locked ? "st-point-marker--locked" : ""
                  }`}
                />
                <text x={p.track1.x} y={p.track1.y - 14} textAnchor="middle" className="st-point-id">
                  {p.id}
                </text>
                <text x={p.track1.x} y={p.track1.y + 24} textAnchor="middle" className="st-point-state">
                  {p.position}
                  {p.locked ? " · LOCKED" : ""}
                </text>
              </g>
            );
          })}

          {/* signals */}
          {signalStates.map((s) => {
            const isInBlockPath = combinedBlockPath.includes(s.id);
            const aspectLower = s.aspect.toLowerCase();
            return (
              <g 
                key={s.id} 
                className={`st-signal-group ${isInBlockPath ? 'st-signal-in-block-path' : ''}`} 
                onClick={() => handleSignalClick(s.id)}
              >
                {/* Signal post */}
                <line x1={s.x} y1={s.y} x2={s.x} y2={s.y - 40} className="st-signal-post" />
                
                {/* Multi-aspect signal head (3 lights) */}
                {/* Top light (Green) */}
                <circle 
                  cx={s.x} 
                  cy={s.y - 42} 
                  r={5} 
                  className="st-signal-lamp"
                  fill={aspectLower === 'green' ? '#00ff00' : '#1a1a1a'}
                  stroke={aspectLower === 'green' ? '#00ff00' : '#333'}
                  strokeWidth="1"
                  filter={aspectLower === 'green' ? 'url(#signal-glow)' : 'none'}
                />
                
                {/* Middle light (Yellow) */}
                <circle 
                  cx={s.x} 
                  cy={s.y - 32} 
                  r={5} 
                  className="st-signal-lamp"
                  fill={aspectLower === 'yellow' ? '#ffff00' : '#1a1a1a'}
                  stroke={aspectLower === 'yellow' ? '#ffff00' : '#333'}
                  strokeWidth="1"
                  filter={aspectLower === 'yellow' ? 'url(#signal-glow)' : 'none'}
                />
                
                {/* Bottom light (Red) */}
                <circle 
                  cx={s.x} 
                  cy={s.y - 22} 
                  r={5} 
                  className="st-signal-lamp"
                  fill={aspectLower === 'red' ? '#ff0000' : '#1a1a1a'}
                  stroke={aspectLower === 'red' ? '#ff0000' : '#333'}
                  strokeWidth="1"
                  filter={aspectLower === 'red' ? 'url(#signal-glow)' : 'none'}
                />
                
                {/* Signal ID label */}
                <text x={s.x} y={s.y - 50} textAnchor="middle" className="st-signal-label">
                  {s.id}
                </text>
              </g>
            );
          })}

          {/* track circuits (sections) */}
          {trackCircuits.map((tc) => (
            <g key={tc.id} className="st-section-group">
              {/* Track circuit boundary markers */}
              <line 
                x1={tc.x - 26} 
                y1={tc.y - 16} 
                x2={tc.x - 26} 
                y2={tc.y + 16} 
                stroke="#666" 
                strokeWidth="2" 
                strokeDasharray="4,2"
                opacity="0.5"
              />
              <line 
                x1={tc.x + 26} 
                y1={tc.y - 16} 
                x2={tc.x + 26} 
                y2={tc.y + 16} 
                stroke="#666" 
                strokeWidth="2" 
                strokeDasharray="4,2"
                opacity="0.5"
              />
              <rect
                x={tc.x - 25}
                y={tc.y - 12}
                width="50"
                height="16"
                rx="3"
                className={`st-section-chip st-section-chip--${tc.state.toLowerCase()}`}
              />
              <text x={tc.x} y={tc.y - 1} textAnchor="middle" className="st-section-label">
                {tc.id}
              </text>
            </g>
          ))}
          
          {/* Legacy sections for backward compatibility */}
          {sections && sections.map((sec) => (
            <g key={sec.id} className="st-section-group">
              <rect
                x={sec.x - 20}
                y={sec.y - 12}
                width="40"
                height="16"
                rx="3"
                className={`st-section-chip st-section-chip--${sec.state.toLowerCase()}`}
              />
              <text x={sec.x} y={sec.y - 1} textAnchor="middle" className="st-section-label">
                {sec.id}
              </text>
            </g>
          ))}

          {/* trains */}
          {trains.map((t) => (
            <g key={t.id} className="st-train-group">
              <rect
                x={t.x - 20}
                y={t.y - 8}
                width="40"
                height="16"
                rx="3"
                className={`st-train-marker ${t.status.includes("DELAYED") ? "st-train-marker--delayed" : ""}`}
              />
              <text x={t.x} y={t.y + 1} textAnchor="middle" className="st-train-number-inline">
                {t.id}
              </text>
              <text x={t.x} y={t.y + 24} textAnchor="middle" className="st-train-info">
                {t.name}
              </text>
              <text x={t.x} y={t.y + 36} textAnchor="middle" className="st-train-status">
                {t.status}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Maintenance Details Overlay */}
      {showMaintenanceOverlay && (
        <STMaintenanceOverlay
          tasks={selectedMaintenanceTasks}
          onClose={() => setShowMaintenanceOverlay(false)}
          position="center"
        />
      )}
    </div>
  );
}