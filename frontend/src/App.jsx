import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Home from "./pages/Home";
import LiveTracking from "./pages/LiveTracking";
import BlockPlanning from "./pages/BlockPlanning";
import ComingSoon from "./pages/ComingSoon";
import AIEngine from "./pages/AIEngine";
import WhatIfSimulator from "./pages/WhatIfSimulator";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import STDashboard from "./pages/STDashboard";
import { getStoredUser, logoutUser } from "./api/client";

function App() {
  // Check localStorage for active session so page refresh persists authentication
  const [currentUser, setCurrentUser] = useState(() => getStoredUser());

  const handleLogin = (userData) => {
    const user =
      typeof userData === "string"
        ? { department: userData.toLowerCase() }
        : userData;

    setCurrentUser(user);
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
  };

  // 1. If not logged in, show Railway Officer Login Console
  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  const dept = (currentUser.department || "").toLowerCase();

  // 2. S&T Department -> Render S&T Dashboard with all routes including AI Engine
  if (dept === "snt" || dept === "signal") {
    return <STDashboard user={currentUser} onLogout={handleLogout} />;
  }

  // 3. For all other departments (Engineering, Traction, etc.) -> Show Main Layout with Home page
  return (
    <BrowserRouter>
      <MainLayout user={currentUser} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/live-tracking" element={<LiveTracking />} />
          <Route path="/block-planning" element={<BlockPlanning />} />
          <Route path="/ai-engine" element={<AIEngine />} />
          <Route path="/what-if" element={<WhatIfSimulator />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;