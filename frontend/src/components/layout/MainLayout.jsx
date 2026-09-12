import React from 'react';
import Sidebar from './Sidebar';

export default function MainLayout({ children, user, onLogout }) {
  return (
    <div className="app-layout-wrapper">
      {/* Fixed Left Sidebar */}
      <Sidebar />

      {/* Full Width Application Workspace */}
      <div className="app-main-viewport">
        {/* Header with user info and Sign Out button */}
        {user && onLogout && (
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: '16px',
            padding: '12px 24px',
            background: '#ffffff',
            borderBottom: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              color: '#374151'
            }}>
              <span style={{ fontWeight: '600' }}>
                {user?.roleInfo?.role || (user?.department ? user.department.toUpperCase() : 'User')}
              </span>
              <span style={{ color: '#9ca3af' }}>•</span>
              <span>{user?.displayName || user?.name || user?.userId || user?.email || 'Officer'}</span>
            </div>
            <button
              onClick={onLogout}
              style={{
                background: '#dc2626',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background 0.2s ease'
              }}
              onMouseOver={(e) => e.target.style.background = '#b91c1c'}
              onMouseOut={(e) => e.target.style.background = '#dc2626'}
            >
              Sign Out
            </button>
          </div>
        )}
        
        <main className="main-content-canvas">
          {children}
        </main>
      </div>
    </div>
  );
}
