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

  const handleLogin = (userData) => {
    const user =
      typeof userData === "string"
        ? { department: userData.toLowerCase() }
        : userData;

    setCurrentUser(user);
    setPreviewingST(false);
    setPreviewingEngineering(false);
    setPreviewingTraction(false);
    setBrowsingGeneral(false);
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setPreviewingST(false);
    setPreviewingEngineering(false);
    setPreviewingTraction(false);
    setBrowsingGeneral(false);
  };

  // 1. If not logged in, show Railway Officer Login Console
  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  const dept = (currentUser.department || "").toLowerCase();

  // 2. S&T Department (or active S&T preview mode) -> Render Delhi-Mumbai S&T Dashboard
  if (dept === "snt" || dept === "signal" || previewingST) {
    return (
      <div>
        {previewingST && (
          <div
            style={{
              background: "#0b2545",
              color: "#fff",
              padding: "6px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "12px",
              borderBottom: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <span>
              ℹ️ <strong>Preview Mode:</strong> Viewing S&T Delhi-Mumbai Corridor Operations (Logged in as {currentUser.name || currentUser.userId})
            </span>
            <button
              type="button"
              onClick={() => setPreviewingST(false)}
              style={{
                background: "#f37021",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                padding: "3px 10px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Return to Department Portal
            </button>
          </div>
        )}
        <STDashboard user={currentUser} onLogout={handleLogout} />
      </div>
    );
  }

  // 3. Engineering Dashboard
  if (previewingEngineering) {
    return (
      <div>
        <div
          style={{
            background: "#0b2545",
            color: "#fff",
            padding: "6px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "12px",
            borderBottom: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <span>
            ℹ️ <strong>Preview Mode:</strong> Viewing Engineering (Civil / Track P-Way) Operations (Logged in as {currentUser.name || currentUser.userId})
          </span>
          <button
            type="button"
            onClick={() => setPreviewingEngineering(false)}
            style={{
              background: "#0284c7",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              padding: "3px 10px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Return to Department Portal
          </button>
        </div>
        <EngineeringDashboard
          user={currentUser}
          onLogout={handleLogout}
          onReturn={() => setPreviewingEngineering(false)}
        />
      </div>
    );
  }

  // 4. Traction Dashboard
  if (previewingTraction) {
    return (
      <div>
        <div
          style={{
            background: "#0b2545",
            color: "#fff",
            padding: "6px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "12px",
            borderBottom: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <span>
            ℹ️ <strong>Preview Mode:</strong> Viewing Traction Distribution (TRD / OHE) Operations (Logged in as {currentUser.name || currentUser.userId})
          </span>
          <button
            type="button"
            onClick={() => setPreviewingTraction(false)}
            style={{
              background: "#d97706",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              padding: "3px 10px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Return to Department Portal
          </button>
        </div>
        <TractionDashboard
          user={currentUser}
          onLogout={handleLogout}
          onReturn={() => setPreviewingTraction(false)}
        />
      </div>
    );
  }

  // 5. If browsing General Console (Live Tracking, Block Planning, System Diagnostics)
  if (browsingGeneral) {
    return (
      <BrowserRouter>
        <div
          style={{
            background: "#0b2545",
            color: "#fff",
            padding: "8px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "13px",
          }}
        >
          <span>
            🚆 <strong>General Multi-Corridor Console</strong> — Logged in as:{" "}
            <strong>{currentUser.name || currentUser.userId}</strong> (
            {currentUser.department?.toUpperCase()})
          </span>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="button"
              onClick={() => setBrowsingGeneral(false)}
              style={{
                background: "#1e293b",
                color: "#fff",
                border: "1px solid #475569",
                borderRadius: "4px",
                padding: "4px 12px",
                cursor: "pointer",
              }}
            >
              Back to Department Portal
            </button>
            <button
              type="button"
              onClick={handleLogout}
              style={{
                background: "#c8102e",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                padding: "4px 12px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
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

  // 6. Department Standby Portal (with options to preview Engineering, Traction, S&T, and General Block Console)
  return (
    <DepartmentStandby
      user={currentUser}
      onLogout={handleLogout}
      onPreviewST={() => setPreviewingST(true)}
      onPreviewEngineering={() => setPreviewingEngineering(true)}
      onPreviewTraction={() => setPreviewingTraction(true)}
      onOpenGeneral={() => setBrowsingGeneral(true)}
    />
  );
}

export default App;