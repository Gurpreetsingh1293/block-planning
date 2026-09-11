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
  RefreshCw,
  LogOut,
  ArrowLeft
} from 'lucide-react';
import '../styles/TractionDashboard.css';
import '../styles/EngineeringDashboard.css';

export default function TractionDashboard({ user, onLogout, onReturn }) {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'tracking' | 'planning'
  const [selectedStation, setSelectedStation] = useState('NDLS');
  const [stationsList, setStationsList] = useState([]);
  const [timetableData, setTimetableData] = useState(null);
  const [loadingTimetable, setLoadingTimetable] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'EXPRESS' | 'FREIGHT' | 'DELAYED'

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

    return true;
  });

  return (
    <div className="trd-dashboard">
      {/* 1. Official Top Navbar */}
      <header className="trd-navbar">
        <div className="trd-navbar-brand">
          <div className="trd-navbar-mark">⚡</div>
          <div className="trd-navbar-titles">
            <span className="trd-navbar-title">INDIAN RAILWAYS</span>
            <span className="trd-navbar-subtitle">Traction Distribution (TRD / Electrical / OHE)</span>
          </div>
        </div>

        {/* Officer Meta & Actions */}
        <div className="trd-navbar-actions">
          <div className="trd-officer-pill">
            <span className="trd-officer-name">{user?.name || 'Sunil Mehta'}</span>
            <span className="trd-officer-dept">
              {user?.designation || 'Divisional Electrical Engineer (TRD)'} ({user?.userId || 'TRD001'})
            </span>
          </div>

          {onReturn && (
            <button
              type="button"
              className="trd-btn-portal"
              onClick={onReturn}
              title="Return to Department Standby Portal"
            >
              <ArrowLeft size={13} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
              Portal
            </button>
          )}

          {onLogout && (
            <button
              type="button"
              className="trd-btn-logout"
              onClick={onLogout}
              title="Sign Out of Railway Operations"
            >
              <LogOut size={13} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
              Sign Out
            </button>
          )}
        </div>
      </header>

      {/* 2. Layout Body with Left Sidebar */}
      <div className="trd-layout-body">
        <aside className="trd-sidebar">
          <div className="trd-sidebar-section-title">CONTROL OPERATIONS</div>
          <nav className="trd-sidebar-nav">
            <button
              type="button"
              className={`trd-sidebar-tab ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => setActiveTab('home')}
            >
              <Home size={16} />
              <span>Home (Timetable)</span>
            </button>
            <button
              type="button"
              className={`trd-sidebar-tab ${activeTab === 'tracking' ? 'active' : ''}`}
              onClick={() => setActiveTab('tracking')}
            >
              <Navigation size={16} />
              <span>Live Train Tracking</span>
            </button>
            <button
              type="button"
              className={`trd-sidebar-tab ${activeTab === 'planning' ? 'active' : ''}`}
              onClick={() => setActiveTab('planning')}
            >
              <Calendar size={16} />
              <span>Block Planning</span>
            </button>
          </nav>
        </aside>

        <div className="trd-content-canvas">
          {/* Sub-Header Banner (Only for Home tab) */}
      {activeTab === 'home' && (
        <div className="trd-header-banner">
          <div className="trd-header-title-group">
            <h1>Traction Distribution (TRD / OHE) Station Timetable Operations</h1>
            <p>Real-time passenger &amp; freight timetable board for power block and corridor maintenance scheduling</p>
          </div>

          <div className="eng-header-controls">
            <div className="eng-station-select-box">
              <MapPin size={15} color="#d97706" />
              <label htmlFor="trd-station-dropdown">Station:</label>
              <select
                id="trd-station-dropdown"
                className="eng-station-select"
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
              className="trd-btn-portal"
              onClick={handleRefresh}
              title="Refresh Station Timetable"
              style={{ color: '#0b2545', borderColor: '#cbd5e1', background: '#f8fafc' }}
            >
              <RefreshCw size={13} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
              Refresh
            </button>
          </div>
        </div>
      )}

      {/* 3. Main Operational Content */}
      <main className="trd-main-content">
        {/* TAB 1: HOME (Railway Train Timetable) */}
        {activeTab === 'home' && (
          <div>
            {/* Timetable Search & Filters */}
            <div className="eng-timetable-filter-bar">
              <div className="eng-search-input-wrapper">
                <Search size={16} className="eng-search-icon" />
                <input
                  type="text"
                  placeholder="Search by train number, name, origin, or destination..."
                  className="eng-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="eng-filter-pills">
                <button
                  type="button"
                  className={`eng-filter-pill ${filterType === 'ALL' ? 'active' : ''}`}
                  onClick={() => setFilterType('ALL')}
                >
                  All Trains ({timetableData?.entries?.length || 0})
                </button>
                <button
                  type="button"
                  className={`eng-filter-pill ${filterType === 'EXPRESS' ? 'active' : ''}`}
                  onClick={() => setFilterType('EXPRESS')}
                >
                  Express &amp; Superfast
                </button>
                <button
                  type="button"
                  className={`eng-filter-pill ${filterType === 'FREIGHT' ? 'active' : ''}`}
                  onClick={() => setFilterType('FREIGHT')}
                >
                  Freight Movements
                </button>
                <button
                  type="button"
                  className={`eng-filter-pill ${filterType === 'DELAYED' ? 'active' : ''}`}
                  onClick={() => setFilterType('DELAYED')}
                >
                  Delayed Trains
                </button>
              </div>
            </div>

            {/* Timetable Cards List */}
            {loadingTimetable ? (
              <div style={{ textAlign: 'center', padding: '40px', background: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <RefreshCw size={24} className="spin-animation" color="#d97706" />
                <p style={{ marginTop: '10px', color: '#64748b' }}>Loading station timetable operations...</p>
              </div>
            ) : filteredEntries.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', background: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <p style={{ color: '#64748b', fontSize: '15px' }}>No trains matching the selected criteria at {selectedStation}.</p>
              </div>
            ) : (
              <div className="eng-timetable-list">
                {filteredEntries.map((train) => (
                  <div
                    key={train.id}
                    className={`eng-train-card ${train.delay > 0 ? 'delayed' : ''}`}
                  >
                    {/* Top Row: Train Identity + Station Arrival/Departure */}
                    <div className="eng-train-header">
                      <div className="eng-train-identity">
                        <span className="eng-train-num">{train.trainNumber}</span>
                        <span className="eng-train-title">{train.trainName}</span>
                        {train.category && (
                          <span className="eng-train-category-tag">{train.category}</span>
                        )}
                      </div>

                      <div className="eng-station-timings">
                        <div className="eng-timing-col">
                          <span className="eng-timing-label">Arrival</span>
                          <span className={`eng-timing-value ${train.arrivalTime === '---' ? 'none' : ''}`}>
                            {train.arrivalTime || '---'}
                          </span>
                        </div>
                        <div className="eng-timing-col">
                          <span className="eng-timing-label">Departure</span>
                          <span className={`eng-timing-value ${train.departureTime === '---' ? 'none' : ''}`}>
                            {train.departureTime || '---'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Middle Row: Journey Progression Diagram */}
                    <div className="eng-journey-diagram">
                      {/* Starting Station */}
                      <div className="eng-journey-start">
                        <span className="eng-journey-station-name">{train.startStation}</span>
                        <span className="eng-journey-time">{train.startTime}</span>
                      </div>

                      {/* Middle: Duration, Stops & Distance */}
                      <div className="eng-journey-mid">
                        <span className="eng-journey-duration-label">Duration</span>
                        <span className="eng-journey-duration-val">{train.duration}</span>
                        <div className="eng-journey-track-line">
                          <div className="eng-track-node" />
                          <span className="eng-track-arrow">➔</span>
                          <div className="eng-track-node" />
                        </div>
                        <span className="eng-journey-meta-sub">
                          {train.stopsCount}{train.distance ? `, ${train.distance}` : ''}
                        </span>
                      </div>

                      {/* End Station */}
                      <div className="eng-journey-end">
                        <span className="eng-journey-station-name">{train.endStation}</span>
                        <span className="eng-journey-time">{train.endTime}</span>
                      </div>
                    </div>

                    {/* Bottom Row: Service Days & Operational Badges */}
                    <div className="eng-card-bottom">
                      <div className="eng-service-days-group">
                        <span className="eng-service-days-label">Service Days:</span>
                        <div className="eng-service-days-chips">
                          {(train.serviceDays || [
                            { day: 'M', active: true },
                            { day: 'T', active: true },
                            { day: 'W', active: true },
                            { day: 'T', active: true },
                            { day: 'F', active: true },
                            { day: 'S', active: true },
                            { day: 'S', active: true }
                          ]).map((d, index) => (
                            <span
                              key={index}
                              className={`eng-day-circle ${d.active ? 'active' : ''}`}
                              title={`${d.day}: ${d.active ? 'Runs' : 'Does not run'}`}
                            >
                              {d.day}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="eng-card-badges">
                        {train.platform && (
                          <span className="eng-pf-pill">{train.platform}</span>
                        )}
                        <StatusPill status={train.status} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: LIVE TRAIN TRACKING */}
        {activeTab === 'tracking' && (
          <div className="eng-tab-workspace">
            <LiveTracking />
          </div>
        )}

        {/* TAB 3: BLOCK PLANNING */}
        {activeTab === 'planning' && (
          <div className="eng-tab-workspace">
            <BlockPlanning />
          </div>
        )}
      </main>
        </div>
      </div>
    </div>
  );
}
