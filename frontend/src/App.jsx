import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import LiveTracking from './pages/LiveTracking';
import BlockPlanning from './pages/BlockPlanning';
import ComingSoon from './pages/ComingSoon';
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import STDashboard from "./pages/STDashboard";

function App() {
  const [department, setDepartment] = useState(null);

  const handleLogin = (selectedDepartment) => {
    setDepartment(selectedDepartment);
  };

  // If not logged in, show login page
  if (!department) {
    return <Login onLogin={handleLogin} />;
  }

  // If logged in as S&T department, show S&T Dashboard
  if (department === "snt" || department === "S&T") {
    return <STDashboard />;
  }

  // For other departments, show the main app with routing
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

export default App;