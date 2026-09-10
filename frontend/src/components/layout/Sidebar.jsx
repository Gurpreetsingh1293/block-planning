import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Navigation,
  Calendar,
  Sparkles,
  Activity
} from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    {
      to: '/',
      label: 'Home',
      icon: Home
    },
    {
      to: '/live-tracking',
      label: 'Live Tracking',
      icon: Navigation
    },
    {
      to: '/block-planning',
      label: 'Block Planning',
      icon: Calendar
    },
    {
      to: '/coming-soon',
      label: 'Coming Soon',
      icon: Sparkles
    }
  ];

  return (
    <aside className="app-sidebar">
      {/* 1. Custom Logo Placeholder Area */}
      <div className="sidebar-logo-container">
        <div className="custom-logo-placeholder" title="Custom Logo Area (Swap with PNG/SVG/WebP)">
          <div className="logo-placeholder-frame">
            <span className="logo-placeholder-text">[ LOGO PLACEHOLDER ]</span>
          </div>
        </div>

        {/* 2. Product Branding */}
        <div className="sidebar-brand-text">
          <h1 className="brand-product-name">BLOCK PLANNER</h1>
          <p className="brand-railways-tag">Indian Railways</p>
        </div>
      </div>

      {/* 3. Navigation Links */}
      <nav className="sidebar-nav">
        <div className="nav-section-title">CONTROL OPERATIONS</div>
        <ul className="nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.to} className="nav-item">
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'nav-link-active' : ''}`
                  }
                  end={item.to === '/'}
                >
                  <Icon className="nav-icon" size={18} />
                  <span className="nav-label">{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* 4. System Operational Status Badge */}
      <div className="sidebar-footer">
        <div className="system-health-pill">
          <div className="health-indicator-pulse" />
          <div className="health-text">
            <span className="health-title">Northern Division</span>
            <span className="health-subtitle">Control Room Active</span>
          </div>
        </div>

        <NavLink
          to="/dashboard"
          className="system-diagnostics-link"
          title="Monorepo Diagnostics & Health Card"
        >
          <Activity size={13} />
          <span>System Diagnostics</span>
        </NavLink>
      </div>
    </aside>
  );
}
