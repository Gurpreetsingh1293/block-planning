import React, { useState, useEffect } from 'react';
import { fetchHealth } from '../api/client';
import { Activity, Database, Clock, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function HealthCard() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);

  const checkStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchHealth();
      setHealth(data);
      setLastChecked(new Date().toLocaleTimeString());
    } catch (err) {
      setError(err.message || 'Unable to connect to backend server');
      setHealth(null);
      setLastChecked(new Date().toLocaleTimeString());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  return (
    <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Activity size={20} color="#38bdf8" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Backend Connection Status</h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Verifies end-to-end communication with Express API & MongoDB
          </p>
        </div>

        <div>
          {loading ? (
            <span className="badge badge-warning">
              <span className="badge-pulse" />
              Checking...
            </span>
          ) : health && health.status === 'ok' ? (
            <span className="badge badge-success">
              <span className="badge-pulse" />
              Connected (200 OK)
            </span>
          ) : (
            <span className="badge badge-danger">
              <span className="badge-pulse" />
              Disconnected
            </span>
          )}
        </div>
      </div>

      {error ? (
        <div style={{
          background: 'rgba(244, 63, 94, 0.1)',
          border: '1px solid rgba(244, 63, 94, 0.25)',
          borderRadius: '10px',
          padding: '1rem',
          marginBottom: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fb7185', fontWeight: 600, marginBottom: '0.5rem' }}>
            <AlertTriangle size={18} />
            <span>Connection Failed</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#fda4af', marginBottom: '0.75rem' }}>
            {error}
          </p>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <strong>Troubleshooting:</strong>
            <ul style={{ paddingLeft: '1.2rem', marginTop: '0.25rem' }}>
              <li>Ensure Express backend is running on <code>http://localhost:5000</code></li>
              <li>Check if <code>cd backend && npm run dev</code> is active</li>
            </ul>
          </div>
        </div>
      ) : health ? (
        <div>
          <div className="kv-row">
            <span className="kv-key">Service Name</span>
            <span className="kv-val">{health.service}</span>
          </div>
          <div className="kv-row">
            <span className="kv-key">Database State</span>
            <span className="kv-val" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Database size={14} color={health.database?.isConnected ? '#34d399' : '#fbbf24'} />
              {health.database?.status?.toUpperCase()}
            </span>
          </div>
          <div className="kv-row">
            <span className="kv-key">Server Uptime</span>
            <span className="kv-val">{health.uptimeSeconds}s</span>
          </div>
          <div className="kv-row">
            <span className="kv-key">Last Checked</span>
            <span className="kv-val">{lastChecked || 'Just now'}</span>
          </div>
        </div>
      ) : null}

      <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          className="btn btn-primary"
          onClick={checkStatus}
          disabled={loading}
          id="btn-refresh-health"
        >
          <RefreshCw size={16} className={loading ? 'badge-pulse' : ''} />
          {loading ? 'Testing...' : 'Test Connection Again'}
        </button>
      </div>
    </div>
  );
}
