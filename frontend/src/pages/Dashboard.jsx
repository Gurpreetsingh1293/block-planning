import React from 'react';
import HealthCard from '../components/HealthCard';
import { Train, Layers, Calendar, Cpu, GitBranch, ArrowUpRight } from 'lucide-react';

export default function Dashboard() {
  return (
    <main>
      {/* Top Metric Cards */}
      <div className="stats-grid">
        <div className="stat-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-label">Track Corridors</span>
            <Layers size={18} color="var(--accent-cyan)" />
          </div>
          <span className="stat-value">5 Active</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>NDLS - GZB, KOTA - RTM</span>
        </div>

        <div className="stat-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-label">Daily Trains</span>
            <Train size={18} color="var(--accent-blue)" />
          </div>
          <span className="stat-value">142 Rakes</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Vande Bharat, Rajdhani, Goods</span>
        </div>

        <div className="stat-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-label">Block Requests</span>
            <Calendar size={18} color="var(--accent-amber)" />
          </div>
          <span className="stat-value">4 Pending</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>P-Way Tamping & OHE Wire</span>
        </div>

        <div className="stat-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-label">ML Optimizer</span>
            <Cpu size={18} color="var(--accent-emerald)" />
          </div>
          <span className="stat-value">FastAPI</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Risk & Window Evaluation</span>
        </div>
      </div>

      {/* Main Grid: Health Card & Quick Reference */}
      <div className="grid-2">
        <HealthCard />

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <GitBranch size={20} color="var(--accent-indigo)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Team Workspace Info</h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            6-Member Team Monorepo Architecture & Quick Links
          </p>

          <div className="kv-row">
            <span className="kv-key">Frontend</span>
            <span className="kv-val">React 18 + Vite (Plain JS)</span>
          </div>
          <div className="kv-row">
            <span className="kv-key">Backend</span>
            <span className="kv-val">Express.js (Port 5000)</span>
          </div>
          <div className="kv-row">
            <span className="kv-key">ML Service</span>
            <span className="kv-val">Python FastAPI (Port 8000)</span>
          </div>
          <div className="kv-row">
            <span className="kv-key">Database</span>
            <span className="kv-val">MongoDB (Port 27017)</span>
          </div>

          <div className="terminal-box">
            // API Health Endpoint<br />
            GET http://localhost:5000/api/health
          </div>
        </div>
      </div>
    </main>
  );
}
