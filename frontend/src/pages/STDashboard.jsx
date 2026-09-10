import React, { useState } from "react";
import STTrackDiagram from "../components/STDashboard/STTrackDiagram";
import STStatusPanel from "../components/STDashboard/STStatusPanel";
import STTrainPanel from "../components/STDashboard/STTrainPanel";
import STFilterControls from "../components/STDashboard/STFilterControls";
import STMaintenancePanel from "../components/STDashboard/STMaintenancePanel";
import "../styles/STDashboard.css";

// Import Delhi-Mumbai Corridor data
import delhiMumbaiCorridor from "../data/delhiMumbaiCorridor";
import { maintenanceTasks, maintenanceStatusColors } from "../data/maintenanceData";

// ---------------------------------------------------------------------------
// MOCK DATA
// Replace these arrays/objects with data from the backend API later.
// Shapes are kept deliberately flat and simple so a real API response can be
// dropped in without changing the components below.
// ---------------------------------------------------------------------------

const stationInfo = {
  name: "DELHI-MUMBAI CORRIDOR",
  code: "DMC-01 · 1384 Km",
  systemStatus: "SYSTEM OPERATIONAL",
};

// Main line / loop line geometry (SVG coordinate space is 1200 x 480)
// Keeping legacy data for backward compatibility
const tracks = delhiMumbaiCorridor.tracks;

// Railway points (turnouts). track1 = straight leg, track2 = diverging leg.
const points = delhiMumbaiCorridor.points;

const signals = delhiMumbaiCorridor.signals;

const sections = []; // Legacy sections - using trackCircuits from corridor data

const trains = delhiMumbaiCorridor.trains;

// Demo route data. In the real system this would come from an interlocking
// table on the backend. Here it only drives the frontend SET ROUTE demo.
const routes = delhiMumbaiCorridor.routes;

const statusItems = [
  { label: "SIGNAL SYSTEM", value: "Operational", level: "ok" },
  { label: "INTERLOCKING", value: "Healthy", level: "ok" },
  { label: "TRACK CIRCUITS", value: "24 / 26 Clear", level: "warn" },
  { label: "POINT MACHINES", value: "12 / 12 Healthy", level: "ok" },
  { label: "COMMUNICATION", value: "Connected", level: "ok" },
  { label: "ACTIVE FAULTS", value: "2", level: "critical" },
];

const alerts = [
  { id: "A1", title: "SIGNAL S4 COMMUNICATION FAULT", level: "warning" },
  { id: "A2", title: "POINT P13 STATUS", level: "healthy", detail: "Healthy" },
];

export default function STDashboard({ user, onLogout }) {
  const [filters, setFilters] = useState({
    station: "all",
    status: [],
    taskType: [],
    dateRange: "all"
  });

  // Filter maintenance tasks based on active filters
  const filteredMaintenanceTasks = maintenanceTasks.filter((task) => {
    // Station filter
    if (filters.station !== "all" && task.stationId !== filters.station) {
      return false;
    }

    // Status filter
    if (filters.status.length > 0 && !filters.status.includes(task.status)) {
      return false;
    }

    // Task type filter
    if (filters.taskType.length > 0 && !filters.taskType.includes(task.taskType)) {
      return false;
    }

    // Date range filter would be implemented with actual date logic
    // For now, we'll keep all tasks if "all" is selected
    if (filters.dateRange !== "all") {
      // TODO: Implement date range filtering logic
    }

    return true;
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleMaintenanceTaskClick = (task) => {
    // This could scroll to or highlight the specific task section
    console.log("Task clicked:", task.id);
    // In a full implementation, this could:
    // 1. Scroll the track diagram to the task location
    // 2. Highlight the maintenance section
    // 3. Open the maintenance overlay with this task's details
  };

  return (
    <div className="st-dashboard">
      <header className="st-navbar">
        <div className="st-navbar-brand">
          <div className="st-navbar-mark">IR</div>
          <div className="st-navbar-titles">
            <span className="st-navbar-title">Indian Railways</span>
            <span className="st-navbar-subtitle">Signal &amp; Telecommunication</span>
          </div>
        </div>

        <nav className="st-navbar-nav">
          <a className="st-navbar-link st-navbar-link--active" href="#home">
            Home
          </a>
        </nav>

        <div className="st-navbar-actions">
          <div className="st-navbar-profile">
            <span className="st-navbar-profile-dept">
              {user?.department ? user.department.toUpperCase() : "S&T"}
            </span>
            <span className="st-navbar-profile-id">{user?.userId || "SNT001"}</span>
          </div>
          {onLogout && (
            <button
              className="st-navbar-logout"
              type="button"
              onClick={onLogout}
              title="Sign out of Railway Officer session"
            >
              Sign Out
            </button>
          )}
        </div>
      </header>

      <div className="st-header">
        <div className="st-header-titles">
          <span className="st-header-eyebrow">Signal &amp; Telecommunication</span>
          <h1 className="st-header-title">S&amp;T Operations Control</h1>
        </div>
        <div className="st-header-meta">
          <span className="st-pill st-pill--station">{stationInfo.name}</span>
          <span className="st-pill st-pill--status">{stationInfo.systemStatus}</span>
          {filteredMaintenanceTasks.length !== maintenanceTasks.length && (
            <span className="st-badge st-badge--info">
              {filteredMaintenanceTasks.length} / {maintenanceTasks.length} Tasks
            </span>
          )}
        </div>
      </div>

      <main className="st-main">
        <div className="st-main-content">
          {/* Filter Controls */}
          <STFilterControls
            stations={delhiMumbaiCorridor.stations}
            onFilterChange={handleFilterChange}
            initialFilters={filters}
          />

          {/* Track Diagram */}
          <section className="st-schematic-panel">
            {filteredMaintenanceTasks.length === 0 && (filters.status.length > 0 || filters.taskType.length > 0 || filters.station !== "all") ? (
              <div className="st-empty-state">
                <div className="st-empty-state-icon">🔍</div>
                <h3 className="st-empty-state-title">No Maintenance Tasks Found</h3>
                <p className="st-empty-state-description">
                  No maintenance tasks match your current filter criteria. Try adjusting your filters or reset them to see all tasks.
                </p>
              </div>
            ) : (
              <STTrackDiagram
                tracks={tracks}
                points={points}
                signals={signals}
                sections={sections}
                trains={trains}
                routes={routes}
                stations={delhiMumbaiCorridor.stations}
                stationInfrastructure={delhiMumbaiCorridor.stationInfrastructure}
                trackCircuits={delhiMumbaiCorridor.trackCircuits}
                trackSections={delhiMumbaiCorridor.trackSections}
                maintenanceTasks={filteredMaintenanceTasks}
                maintenanceStatusColors={maintenanceStatusColors}
              />
            )}
          </section>
        </div>

        <aside className="st-side-panel st-scrollable">
          <STStatusPanel status={statusItems} alerts={alerts} />
          <STMaintenancePanel 
            tasks={filteredMaintenanceTasks}
            onTaskClick={handleMaintenanceTaskClick}
          />
        </aside>
      </main>

      <footer className="st-bottom">
        <STTrainPanel trains={trains} />
        
        {/* System Footer Info Bar */}
        <div className="st-footer-info">
          <div className="st-footer-section">
            <span className="st-footer-label">System Time:</span>
            <span className="st-footer-value">{new Date().toLocaleString('en-IN', { 
              dateStyle: 'medium', 
              timeStyle: 'medium',
              timeZone: 'Asia/Kolkata'
            })}</span>
          </div>
          <div className="st-footer-section">
            <span className="st-footer-label">User:</span>
            <span className="st-footer-value">
              {user?.name ? `${user.name} (${user.userId})` : "S&T Officer (SNT001)"}
            </span>
          </div>
          <div className="st-footer-section">
            <span className="st-footer-label">Station:</span>
            <span className="st-footer-value">{stationInfo.code}</span>
          </div>
          <div className="st-footer-section">
            <span className="st-footer-label">System Status:</span>
            <span className="st-footer-value st-footer-status-ok">● OPERATIONAL</span>
          </div>
          <div className="st-footer-section st-footer-copyright">
            <span>Indian Railways S&T Department © 2024 | v2.4.1</span>
          </div>
        </div>
      </footer>
    </div>
  );
}