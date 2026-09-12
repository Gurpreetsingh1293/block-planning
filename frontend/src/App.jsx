import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import MainLayout from "./components/layout/MainLayout";
import Home from "./pages/Home";
import LiveTracking from "./pages/LiveTracking";
import BlockPlanning from "./pages/BlockPlanning";
import ComingSoon from "./pages/ComingSoon";
import AIEngine from "./pages/AIEngine";
import WhatIfSimulator from "./pages/WhatIfSimulator";
import Dashboard from "./pages/Dashboard";
import STDashboard from "./pages/STDashboard";
import RelevanceChat from "./components/common/RelevanceChat";

function AppRoutes() {
  const { user, signOut } = useAuth();

  const dept = (user?.roleInfo?.departmentCode || user?.department || "").toLowerCase();

  // S&T officers (and all Google sign-in users via temporary demo logic — see
  // AuthContext.jsx for the full explanation) get the S&T Operations Dashboard.
  if (dept === "snt" || dept === "signal") {
    return (
      <>
        <STDashboard user={user} onLogout={signOut} />
        <RelevanceChat />
      </>
    );
  }

  // Other departments (Engineering, Traction, etc.) get the Main Layout.
  // When real role lookup is added, the S&T branch above will only activate
  // for actual S&T officers.
  return (
    <BrowserRouter>
      <MainLayout user={user} onLogout={signOut}>
        <Routes>
          <Route path="/"               element={<Home />} />
          <Route path="/live-tracking"  element={<LiveTracking />} />
          <Route path="/block-planning" element={<BlockPlanning />} />
          <Route path="/ai-engine"      element={<AIEngine />} />
          <Route path="/what-if"        element={<WhatIfSimulator />} />
          <Route path="/coming-soon"    element={<ComingSoon />} />
          <Route path="/dashboard"      element={<Dashboard />} />
          <Route path="*"               element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
      <RelevanceChat />
    </BrowserRouter>
  );
}

function App() {
  return (
    <ProtectedRoute>
      <AppRoutes />
    </ProtectedRoute>
  );
}

export default App;
