import React from 'react';
import Dashboard from './pages/Dashboard';
import { ShieldCheck, Activity } from 'lucide-react';

export default function App() {
  return (
    <div className="app-container">
      {/* Top Header */}
      <header className="header">
        <div className="brand-wrapper">
          <div className="brand-icon">
            <span style={{ fontSize: '1.4rem' }}>🚆</span>
          </div>
          <div>
            <h1 className="brand-title">SIH Block Planning System</h1>
            <p className="brand-subtitle">
              Indian Railways Maintenance Block Scheduling & AI Traffic Optimization
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="badge badge-success">
            <ShieldCheck size={14} />
            <span>Monorepo v1.0</span>
          </div>
        </div>
      </header>

      {/* Main Dashboard Page */}
      <Dashboard />
    </div>
  );
}
