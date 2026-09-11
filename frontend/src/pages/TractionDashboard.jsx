import React, { useState, useEffect } from 'react';
import LiveTracking from './LiveTracking';
import BlockPlanning from './BlockPlanning';
import StatusPill from '../components/common/StatusPill';
import { getStationTimetable, getStations } from '../services/stationService';
import {
  Home,
  Navigation,
  Calendar,
  Search,
  MapPin,
  Clock,
  Train,
  CheckCircle2,
  SlidersHorizontal,
  RefreshCw,
  LogOut,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Zap,
  Layers,
  Activity,
  Info,
  Menu,
  X,
  ArrowRight
} from 'lucide-react';
import '../styles/TractionDashboard.css';

export default function TractionDashboard({ user, onLogout, onReturn }) {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'tracking' | 'planning'
  const [selectedStation, setSelectedStation] = useState('NDLS');
  const [stationsList, setStationsList] = useState([]);
  const [timetableData, setTimetableData] = useState(null);
  const [loadingTimetable, setLoadingTimetable] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'EXPRESS' | 'FREIGHT' | 'DELAYED'
  const [directionFilter, setDirectionFilter] = useState('ALL'); // 'ALL' | 'ARRIVAL' | 'DEPARTURE'
  const [expandedTrainId, setExpandedTrainId] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load available stations
  useEffect(() => {
    async function loadStations() {
      const stations = await getStations();
      setStationsList(stations);
    }
    loadStations();
  }, []);

  // Load timetable for selected station
  useEffect(() => {
    async function loadData() {
      setLoadingTimetable(true);
      const data = await getStationTimetable(selectedStation);
      setTimetableData(data);
      setLoadingTimetable(false);
    }
    loadData();
  }, [selectedStation]);

  const handleStationChange = (e) => {
    setSelectedStation(e.target.value);
  };

  const handleRefresh = async () => {
    setLoadingTimetable(true);
    const data = await getStationTimetable(selectedStation);
    setTimetableData(data);
    setLoadingTimetable(false);
  };

  const toggleExpand = (id) => {
    setExpandedTrainId((prev) => (prev === id ? null : id));
  };

  // Filter timetable trains based on search and filter pills
  const filteredEntries = (timetableData?.entries || []).filter((train) => {
    // 1. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchNumber = train.trainNumber?.toLowerCase().includes(q);
      const matchName = train.trainName?.toLowerCase().includes(q);
      const matchRoute = train.route?.toLowerCase().includes(q);
      const matchStart = train.startStation?.toLowerCase().includes(q);
      const matchEnd = train.endStation?.toLowerCase().includes(q);
      if (!matchNumber && !matchName && !matchRoute && !matchStart && !matchEnd) {
        return false;
      }
    }

    // 2. Type Filter Pill
    if (filterType === 'EXPRESS') {
      const cat = (train.category || '').toLowerCase();
      if (!cat.includes('rajdhani') && !cat.includes('shatabdi') && !cat.includes('vande') && !cat.includes('express')) {
        return false;
      }
    } else if (filterType === 'FREIGHT') {
      const cat = (train.category || '').toLowerCase();
      if (!cat.includes('freight') && !cat.includes('cargo')) {
        return false;
      }
    } else if (filterType === 'DELAYED') {
      if (!train.delay || train.delay === 0) {
        return false;
      }
    }

    // 3. Direction Filter
    if (directionFilter === 'ARRIVAL') {
      if (train.type?.toLowerCase() !== 'arrival') return false;
    } else if (directionFilter === 'DEPARTURE') {
      if (train.type?.toLowerCase() !== 'departure') return false;
    }

    return true;
  });

  // Summary statistics
  const totalTrains = timetableData?.entries?.length || 0;
  const onTimeTrains = (timetableData?.entries || []).filter((t) => !t.delay || t.delay === 0).length;
  const delayedTrains = (timetableData?.entries || []).filter((t) => t.delay > 0).length;
  const activePlatforms = new Set((timetableData?.entries || []).map((t) => t.platform).filter(Boolean)).size;

  return (
    <div className="app-layout-wrapper">
      {/* 1. Left Vertical Sidebar (Matching S&T Sidebar Layout & Proportions) */}
      <aside className={`app-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        {/* Logo & Product Branding */}
        <div className="sidebar-logo-container">
          <div className="custom-logo-placeholder" title="Indian Railways Intelligent Block Planning">
            <div className="logo-placeholder-frame">
              <span className="logo-placeholder-text">[ LOGO PLACEHOLDER ]</span>
            </div>
          </div>

          <div className="sidebar-brand-text">
            <h1 className="brand-product-name">BLOCK PLANNER</h1>
            <p className="brand-railways-tag">Indian Railways</p>
          </div>

          {/* Department Identity Tag */}
          <div className="sidebar-dept-tag-pill trd-dept-pill">
            <span className="dept-tag-dot trd-dot"></span>
            <span>Traction (TRD / Electrical / OHE)</span>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="sidebar-nav">
          <div className="nav-section-title">CONTROL OPERATIONS</div>
          <ul className="nav-list">
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link ${activeTab === 'home' ? 'nav-link-active' : ''}`}
                onClick={() => {
                  setActiveTab('home');
                  setMobileMenuOpen(false);
                }}
              >
                <Home className="nav-icon" size={18} />
                <span className="nav-label">Home (Timetable)</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link ${activeTab === 'tracking' ? 'nav-link-active' : ''}`}
                onClick={() => {
                  setActiveTab('tracking');
                  setMobileMenuOpen(false);
                }}
              >
                <Navigation className="nav-icon" size={18} />
                <span className="nav-label">Live Train Tracking</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link ${activeTab === 'planning' ? 'nav-link-active' : ''}`}
                onClick={() => {
                  setActiveTab('planning');
                  setMobileMenuOpen(false);
                }}
              >
                <Calendar className="nav-icon" size={18} />
                <span className="nav-label">Block Planning</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* System Health / Operational Status Footer */}
        <div className="sidebar-footer">
          <div className="system-health-pill">
            <div className="health-indicator-pulse" />
            <div className="health-text">
              <span className="health-title">Northern Division</span>
              <span className="health-subtitle">Control Room Active</span>
            </div>
          </div>
          <div className="sidebar-dept-telemetry trd-telemetry">
            <Zap size={13} color="#d97706" />
            <span>25kV OHE SCADA Telemetry</span>
          </div>
        </div>
      </aside>

      {/* 2. Main Viewport to the Right of Sidebar */}
      <div className="app-main-viewport">
        {/* Top Navbar Header (Matching S&T Navbar) */}
        <header className="st-navbar">
          <div className="st-navbar-brand">
            <button
              type="button"
              className="st-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              title="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="st-navbar-mark">⚡</div>
            <div className="st-navbar-titles">
              <span className="st-navbar-title">INDIAN RAILWAYS</span>
              <span className="st-navbar-subtitle">Traction Distribution (TRD / Electrical / OHE)</span>
            </div>
          </div>

          <div className="st-navbar-actions">
            <div className="st-navbar-profile">
              <span className="st-navbar-profile-dept">
                {user?.department ? user.department.toUpperCase() : 'TRACTION (TRD / OHE)'}
              </span>
              <span className="st-navbar-profile-id">
                {user?.name || 'Sunil Mehta'} ({user?.userId || 'TRD001'})
              </span>
            </div>

            {onReturn && (
              <button
                type="button"
                className="st-navbar-portal-btn"
                onClick={onReturn}
                title="Return to Department Standby Portal"
              >
                <ArrowLeft size={13} style={{ marginRight: '5px' }} />
                Portal
              </button>
            )}

            {onLogout && (
              <button
                type="button"
                className="st-navbar-logout"
                onClick={onLogout}
                title="Sign out of Railway Operations"
              >
                Sign Out
              </button>
            )}
          </div>
        </header>

        {/* Operational Header when on Home Tab (Matching S&T Header) */}
        {activeTab === 'home' && (
          <div className="st-header">
            <div className="st-header-titles">
              <span className="st-header-eyebrow">TRACTION DISTRIBUTION (TRD / OHE) OPERATIONS</span>
              <h1 className="st-header-title">Station Timetable Operations Control</h1>
            </div>

            <div className="st-header-meta">
              <span className="st-pill st-pill--station">
                <MapPin size={13} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                {timetableData?.stationName || selectedStation} ({selectedStation})
              </span>
              <span className="st-pill st-pill--status">SYSTEM OPERATIONAL</span>
              <span className="st-badge st-badge--info">
                {filteredEntries.length} / {totalTrains} Trains
              </span>
            </div>

            <div className="st-header-controls">
              <div className="st-station-select-box">
                <label htmlFor="trd-station-select-input">Station:</label>
                <select
                  id="trd-station-select-input"
                  className="st-station-select"
                  value={selectedStation}
                  onChange={handleStationChange}
                >
                  {stationsList.length > 0 ? (
                    stationsList.map((stn) => (
                      <option key={stn.code} value={stn.code}>
                        {stn.name} ({stn.code})
                      </option>
                    ))
                  ) : (
                    <option value="NDLS">New Delhi (NDLS)</option>
                  )}
                </select>
              </div>

              <button
                type="button"
                className="st-btn-refresh"
                onClick={handleRefresh}
                title="Refresh Station Timetable"
                disabled={loadingTimetable}
              >
                <RefreshCw
                  size={13}
                  className={loadingTimetable ? 'spin-animation' : ''}
                  style={{ marginRight: '5px' }}
                />
                Refresh
              </button>
            </div>
          </div>
        )}

        {/* Main Content Canvas */}
        <main className="main-content-canvas">
          {/* TAB 1: HOME (Enhanced Timetable Operations) */}
          {activeTab === 'home' && (
            <div className="trd-timetable-workspace">
              {/* Summary Stats Strip */}
              <div className="trd-stats-strip">
                <div className="trd-stat-card">
                  <div className="trd-stat-icon-wrap" style={{ background: '#fef3c7', color: '#d97706' }}>
                    <Train size={18} />
                  </div>
                  <div className="trd-stat-details">
                    <span className="trd-stat-val">{totalTrains}</span>
                    <span className="trd-stat-label">Scheduled Movements</span>
                  </div>
                </div>

                <div className="trd-stat-card">
                  <div className="trd-stat-icon-wrap" style={{ background: '#dcfce7', color: '#16a34a' }}>
                    <CheckCircle2 size={18} />
                  </div>
                  <div className="trd-stat-details">
                    <span className="trd-stat-val">{onTimeTrains}</span>
                    <span className="trd-stat-label">On-Time Services</span>
                  </div>
                </div>

                <div className="trd-stat-card">
                  <div className="trd-stat-icon-wrap" style={{ background: '#fee2e2', color: '#dc2626' }}>
                    <Clock size={18} />
                  </div>
                  <div className="trd-stat-details">
                    <span className="trd-stat-val">{delayedTrains}</span>
                    <span className="trd-stat-label">Delayed Movements</span>
                  </div>
                </div>

                <div className="trd-stat-card">
                  <div className="trd-stat-icon-wrap" style={{ background: '#ffedd5', color: '#ea580c' }}>
                    <Layers size={18} />
                  </div>
                  <div className="trd-stat-details">
                    <span className="trd-stat-val">{activePlatforms}</span>
                    <span className="trd-stat-label">Active Platforms</span>
                  </div>
                </div>
              </div>

              {/* Search & Filter Toolbar */}
              <div className="trd-timetable-toolbar">
                <div className="trd-search-box">
                  <Search size={16} className="trd-search-icon" />
                  <input
                    type="text"
                    placeholder="Search by train number, name, origin, or destination..."
                    className="trd-search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      className="trd-search-clear"
                      onClick={() => setSearchQuery('')}
                    >
                      ×
                    </button>
                  )}
                </div>

                <div className="trd-filters-group">
                  <div className="trd-category-pills">
                    <button
                      type="button"
                      className={`trd-filter-pill ${filterType === 'ALL' ? 'active' : ''}`}
                      onClick={() => setFilterType('ALL')}
                    >
                      All Trains ({totalTrains})
                    </button>
                    <button
                      type="button"
                      className={`trd-filter-pill ${filterType === 'EXPRESS' ? 'active' : ''}`}
                      onClick={() => setFilterType('EXPRESS')}
                    >
                      Express &amp; Superfast
                    </button>
                    <button
                      type="button"
                      className={`trd-filter-pill ${filterType === 'FREIGHT' ? 'active' : ''}`}
                      onClick={() => setFilterType('FREIGHT')}
                    >
                      Freight Movements
                    </button>
                    <button
                      type="button"
                      className={`trd-filter-pill ${filterType === 'DELAYED' ? 'active' : ''}`}
                      onClick={() => setFilterType('DELAYED')}
                    >
                      Delayed ({delayedTrains})
                    </button>
                  </div>

                  <div className="trd-direction-pills">
                    <button
                      type="button"
                      className={`trd-dir-pill ${directionFilter === 'ALL' ? 'active' : ''}`}
                      onClick={() => setDirectionFilter('ALL')}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      className={`trd-dir-pill ${directionFilter === 'ARRIVAL' ? 'active' : ''}`}
                      onClick={() => setDirectionFilter('ARRIVAL')}
                    >
                      Arrivals
                    </button>
                    <button
                      type="button"
                      className={`trd-dir-pill ${directionFilter === 'DEPARTURE' ? 'active' : ''}`}
                      onClick={() => setDirectionFilter('DEPARTURE')}
                    >
                      Departures
                    </button>
                  </div>
                </div>
              </div>

              {/* Timetable List / Cards */}
              {loadingTimetable ? (
                <div className="trd-empty-state">
                  <RefreshCw size={28} className="spin-animation" color="#d97706" />
                  <p className="trd-empty-title">Loading Station Timetable Operations...</p>
                  <p className="trd-empty-subtitle">Fetching live corridor movement matrix</p>
                </div>
              ) : filteredEntries.length === 0 ? (
                <div className="trd-empty-state">
                  <Search size={32} color="#94a3b8" />
                  <p className="trd-empty-title">No Movements Matching Criteria</p>
                  <p className="trd-empty-subtitle">Try clearing search query or selecting another filter pill</p>
                </div>
              ) : (
                <div className="trd-timetable-cards">
                  {filteredEntries.map((train) => {
                    const isExpanded = expandedTrainId === train.id;
                    const isDelayed = train.delay > 0;

                    return (
                      <div
                        key={train.id}
                        className={`trd-train-card ${isDelayed ? 'trd-card-delayed' : ''} ${
                          isExpanded ? 'trd-card-expanded' : ''
                        }`}
                      >
                        {/* 1. Header Bar: Identity, Type, Platform & Status */}
                        <div className="trd-card-header">
                          <div className="trd-train-identity">
                            <span className="trd-train-num-badge">{train.trainNumber}</span>
                            <div className="trd-train-names">
                              <h3 className="trd-train-name">{train.trainName}</h3>
                              <div className="trd-train-badges">
                                {train.category && (
                                  <span className="trd-category-badge">{train.category}</span>
                                )}
                                {train.type && (
                                  <span className={`trd-type-badge ${train.type.toLowerCase()}`}>
                                    {train.type}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="trd-header-right-badges">
                            {train.platform && (
                              <span className="trd-platform-badge">{train.platform}</span>
                            )}
                            <StatusPill status={train.status} />
                            {isDelayed && (
                              <span className="trd-delay-pill">+{train.delay}m Late</span>
                            )}
                          </div>
                        </div>

                        {/* 2. Middle Section: Journey Progression & Station Timings */}
                        <div className="trd-card-body">
                          {/* Left: Journey Route Visualization */}
                          <div className="trd-journey-visualizer">
                            <div className="trd-station-point start">
                              <span className="trd-stn-code">{train.startStation}</span>
                              <span className="trd-stn-time">{train.startTime}</span>
                            </div>

                            <div className="trd-journey-track">
                              <span className="trd-journey-duration">{train.duration}</span>
                              <div className="trd-track-line-wrapper">
                                <div className="trd-track-node" />
                                <div className="trd-track-rail" />
                                <ArrowRight size={14} className="trd-track-arrow-icon" />
                                <div className="trd-track-rail" />
                                <div className="trd-track-node" />
                              </div>
                              <span className="trd-journey-meta">
                                {train.stopsCount} · {train.distance || 'Main Trunk'}
                              </span>
                            </div>

                            <div className="trd-station-point end">
                              <span className="trd-stn-code">{train.endStation}</span>
                              <span className="trd-stn-time">{train.endTime}</span>
                            </div>
                          </div>

                          {/* Right: Station Timings Box */}
                          <div className="trd-station-timings-box">
                            <div className="trd-time-block">
                              <span className="trd-time-label">ARRIVAL</span>
                              <span
                                className={`trd-time-val ${
                                  train.arrivalTime === '---' ? 'muted' : ''
                                }`}
                              >
                                {train.arrivalTime || '---'}
                              </span>
                            </div>
                            <div className="trd-time-divider" />
                            <div className="trd-time-block">
                              <span className="trd-time-label">DEPARTURE</span>
                              <span
                                className={`trd-time-val ${
                                  train.departureTime === '---' ? 'muted' : ''
                                }`}
                              >
                                {train.departureTime || '---'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* 3. Card Bottom: Service Days, Operational Remarks & Expand Button */}
                        <div className="trd-card-footer">
                          <div className="trd-service-days-wrap">
                            <span className="trd-footer-label">Runs On:</span>
                            <div className="trd-days-list">
                              {(
                                train.serviceDays || [
                                  { day: 'M', active: true },
                                  { day: 'T', active: true },
                                  { day: 'W', active: true },
                                  { day: 'T', active: true },
                                  { day: 'F', active: true },
                                  { day: 'S', active: true },
                                  { day: 'S', active: true }
                                ]
                              ).map((d, index) => (
                                <span
                                  key={index}
                                  className={`trd-day-dot ${d.active ? 'active' : ''}`}
                                  title={`${d.day}: ${d.active ? 'Runs' : 'No service'}`}
                                >
                                  {d.day}
                                </span>
                              ))}
                            </div>
                          </div>

                          {train.remarks && (
                            <div className="trd-remarks-wrap">
                              <span className="trd-footer-label">Operational Note:</span>
                              <span className="trd-remarks-text">{train.remarks}</span>
                            </div>
                          )}

                          <button
                            type="button"
                            className="trd-btn-details-toggle"
                            onClick={() => toggleExpand(train.id)}
                          >
                            <span>{isExpanded ? 'Hide Details' : 'Operational Details'}</span>
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                        </div>

                        {/* 4. Expandable Operational Telemetry Drawer */}
                        {isExpanded && (
                          <div className="trd-expanded-drawer">
                            <div className="trd-drawer-grid">
                              <div className="trd-drawer-item">
                                <span className="trd-drawer-label">25kV OHE Power Block Clearance:</span>
                                <span className="trd-drawer-val text-amber">
                                  {train.type === 'Departure'
                                    ? 'Catenary isolation permissible post-departure with Section Isolator SI-4'
                                    : 'Substation Feeder F-2 power feed active on track'}
                                </span>
                              </div>

                              <div className="trd-drawer-item">
                                <span className="trd-drawer-label">Pantograph / Traction Current:</span>
                                <span className="trd-drawer-val">
                                  25kV AC · Single Pantograph Mode · 450A Nominal Draw
                                </span>
                              </div>

                              <div className="trd-drawer-item">
                                <span className="trd-drawer-label">Route Corridor:</span>
                                <span className="trd-drawer-val">{train.route || `${train.startStation} ➔ ${train.endStation}`}</span>
                              </div>

                              <div className="trd-drawer-item">
                                <span className="trd-drawer-label">Traction Substation (TSS):</span>
                                <span className="trd-drawer-val text-green">
                                  TSS Tuglakabad &amp; Okhla Switching Post (SP) Connected
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: LIVE TRAIN TRACKING */}
          {activeTab === 'tracking' && (
            <div className="trd-tab-workspace">
              <LiveTracking />
            </div>
          )}

          {/* TAB 3: BLOCK PLANNING */}
          {activeTab === 'planning' && (
            <div className="trd-tab-workspace">
              <BlockPlanning />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
