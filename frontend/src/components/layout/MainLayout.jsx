import React from 'react';
import Sidebar from './Sidebar';

export default function MainLayout({ children }) {
  return (
    <div className="app-layout-wrapper">
      {/* Fixed Left Sidebar */}
      <Sidebar />

      {/* Full Width Application Workspace */}
      <div className="app-main-viewport">
        <main className="main-content-canvas">
          {children}
        </main>
      </div>
    </div>
  );
}
