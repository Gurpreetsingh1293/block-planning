import React from 'react';
import './DepartmentStandby.css';

const DEPARTMENT_SPECS = {
  engineering: {
    name: 'Engineering (Civil / Track P-Way)',
    code: 'ENG',
    title: 'Track Maintenance & Structural Control',
    description:
      'The dedicated Civil Engineering Track Health, Deep Screening, and Machine Packing Operations dashboard is currently under active development by your team.',
    modules: [
      {
        tag: 'P-Way Maintenance',
        title: 'Tie Tamping & Ballast Regulating',
        desc: 'Automated machine gang dispatching and corridor maintenance booking with live track possession tracking.',
      },
      {
        tag: 'Safety & Integrity',
        title: 'Ultrasonic Flaw Detection (USFD)',
        desc: 'Integration of rail fracture telemetry and ultrasonic weld integrity verification across trunk routes.',
      },
      {
        tag: 'Track Geometry',
        title: 'Track Recording Car (TRC) Analytics',
        desc: 'Automated speed restriction recommendations based on real-time track unevenness indices.',
      },
    ],
  },
  traction: {
    name: 'Traction Distribution (TRD / OHE)',
    code: 'TRD',
    title: 'Overhead Equipment & Power Block Control',
    description:
      'The dedicated Traction Distribution (TRD) 25kV OHE Power Block and Substation Switching Operations dashboard is currently under active development by your team.',
    modules: [
      {
        tag: 'OHE Power Isolation',
        title: 'Substation & Feeder Switching',
        desc: 'Digital permit-to-work (PTW) generation and SCADA isolator status synchronization during maintenance blocks.',
      },
      {
        tag: 'Asset Reliability',
        title: 'Catenary & Contact Wire Wear',
        desc: 'Predictive replacement schedules based on pantograph contact telemetry and thermal hotspot camera feeds.',
      },
      {
        tag: 'Emergency Response',
        title: 'OHE Breakdown & Tower Wagon Dispatch',
        desc: 'Rapid GPS tracking and route clearance for self-propelled inspection cars during wire snapping events.',
      },
    ],
  },
};

export default function DepartmentStandby({ user, onLogout, onPreviewST, onOpenGeneral }) {
  const deptKey = (user?.department || 'engineering').toLowerCase();
  const spec = DEPARTMENT_SPECS[deptKey] || DEPARTMENT_SPECS.engineering;

  return (
    <div className="standby-page">
      {/* Official Railway Navbar */}
      <header className="standby-navbar">
        <div className="standby-brand">
          <div className="standby-brand-mark">IR</div>
          <div>
            <div className="standby-brand-title">INDIAN RAILWAYS</div>
            <div className="standby-brand-sub">National Block Planning & Corridor Control</div>
          </div>
        </div>

        <div className="standby-officer-meta">
          <div className="standby-officer-pill">
            <span className="standby-officer-name">{user?.name || 'Railway Official'}</span>
            <span className="standby-officer-role">
              {user?.designation || 'Section Engineer'} ({user?.userId || spec.code})
            </span>
          </div>

          <button className="standby-logout-btn" type="button" onClick={onLogout}>
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="standby-content">
        <div className="standby-card">
          <div className="standby-header">
            <div className="standby-badge-row">
              <span className="standby-dept-badge">{spec.name}</span>
              <span className="standby-status-pill">
                <span className="standby-status-dot"></span>
                In Development by Team
              </span>
            </div>
            <span style={{ fontSize: '13px', color: '#64748b' }}>
              Portal Version: <strong>v2.4-preview</strong>
            </span>
          </div>

          <h1 className="standby-title">{spec.title}</h1>
          <p className="standby-desc">
            {spec.description}
            <br />
            Currently, the <strong>Signal & Telecommunication (S&T) Delhi-Mumbai Corridor</strong> dashboard has been completed and is fully operational. You can preview the live S&T operational console below, or explore the general planning console.
          </p>

          {/* Quick Actions Bar */}
          <div className="standby-actions">
            <button className="btn-preview-st" type="button" onClick={onPreviewST}>
              <span>🚦</span>
              <span>Preview Live S&T Dashboard</span>
            </button>

            <button className="btn-general-console" type="button" onClick={onOpenGeneral}>
              <span>🗺️</span>
              <span>Open General Block Console</span>
            </button>

            <button className="btn-switch-account" type="button" onClick={onLogout}>
              Switch Officer Account
            </button>
          </div>

          {/* Module Roadmap Cards */}
          <h2 className="standby-preview-title">Expected Modules for {spec.name}:</h2>
          <div className="standby-features-grid">
            {spec.modules.map((mod, index) => (
              <div key={index} className="feature-card">
                <span className="feature-badge">{mod.tag}</span>
                <h3 className="feature-name">{mod.title}</h3>
                <p className="feature-detail">{mod.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
