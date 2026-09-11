import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Home from "./pages/Home";
import LiveTracking from "./pages/LiveTracking";
import BlockPlanning from "./pages/BlockPlanning";
import ComingSoon from "./pages/ComingSoon";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import STDashboard from "./pages/STDashboard";
import EngineeringDashboard from "./pages/EngineeringDashboard";
import TractionDashboard from "./pages/TractionDashboard";
import DepartmentStandby from "./pages/DepartmentStandby";
import { getStoredUser, logoutUser } from "./api/client";

function App() {
  // Check localStorage for active session so page refresh persists authentication
  const [currentUser, setCurrentUser] = useState(() => getStoredUser());
  const [previewingST, setPreviewingST] = useState(false);
  const [previewingEngineering, setPreviewingEngineering] = useState(false);
  const [previewingTraction, setPreviewingTraction] = useState(false);
  const [browsingGeneral, setBrowsingGeneral] = useState(false);
  const [browsingStandby, setBrowsingStandby] = useState(false);

  const resetViews = () => {
    setPreviewingST(false);
    setPreviewingEngineering(false);
    setPreviewingTraction(false);
    setBrowsingGeneral(false);
    setBrowsingStandby(false);
  };

  const handleLogin = (userData) => {
    const user =
      typeof userData === "string"
        ? { department: userData.toLowerCase() }
        : userData;

    setCurrentUser(user);
    resetViews();
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    resetViews();
  };

  // 1. If not logged in, show Railway Officer Login Console
  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  const dept = (currentUser.department || "").toLowerCase();

  // 2. Explicit Previews from Standby Portal
  if (previewingEngineering) {
    return (
      <EngineeringDashboard
        user={currentUser}
        onLogout={handleLogout}
        onReturn={() => {
          setPreviewingEngineering(false);
          setBrowsingStandby(true);
        }}
      />
    );
  }

  if (previewingTraction) {
    return (
      <TractionDashboard
        user={currentUser}
        onLogout={handleLogout}
        onReturn={() => {
          setPreviewingTraction(false);
          setBrowsingStandby(true);
        }}
      />
    );
  }

  if (previewingST) {
    return <STDashboard user={currentUser} onLogout={handleLogout} />;
  }

  // 3. Standby Portal (if user explicitly navigated to it via onReturn)
  if (browsingStandby) {
    return (
      <DepartmentStandby
        user={currentUser}
        onLogout={handleLogout}
        onPreviewST={() => {
          setBrowsingStandby(false);
          setPreviewingST(true);
        }}
        onPreviewEngineering={() => {
          setBrowsingStandby(false);
          setPreviewingEngineering(true);
        }}
        onPreviewTraction={() => {
          setBrowsingStandby(false);
          setPreviewingTraction(true);
        }}
        onOpenGeneral={() => {
          setBrowsingStandby(false);
          setBrowsingGeneral(true);
        }}
      />
    );
  }

  // 4. Department-Specific Primary Dashboards upon Login
  if (!browsingGeneral) {
    // S&T Department -> Render Delhi-Mumbai S&T Dashboard
    if (dept === "snt" || dept === "signal") {
      return <STDashboard user={currentUser} onLogout={handleLogout} />;
    }

    // Engineering Department -> Render Engineering (Civil / P-Way) Dashboard
    if (dept === "engineering" || dept === "eng" || dept === "civil" || dept === "pway") {
      return (
        <EngineeringDashboard
          user={currentUser}
          onLogout={handleLogout}
          onReturn={() => setBrowsingStandby(true)}
        />
      );
    }

    // Traction Department -> Render Traction (TRD / OHE) Dashboard
    if (dept === "traction" || dept === "trd" || dept === "electrical") {
      return (
        <TractionDashboard
          user={currentUser}
          onLogout={handleLogout}
          onReturn={() => setBrowsingStandby(true)}
        />
      );
    }
  }

  // 5. General Multi-Corridor Console with MainLayout and Full Routing
  return (
    <BrowserRouter>
      <MainLayout user={currentUser} onLogout={handleLogout}>
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

export default App;