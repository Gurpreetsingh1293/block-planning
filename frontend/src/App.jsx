import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import LiveTracking from './pages/LiveTracking';
import BlockPlanning from './pages/BlockPlanning';
import ComingSoon from './pages/ComingSoon';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/live-tracking" element={<LiveTracking />} />
          <Route path="/block-planning" element={<BlockPlanning />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}
