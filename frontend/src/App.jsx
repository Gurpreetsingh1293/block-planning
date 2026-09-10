import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import STDashboard from "./pages/STDashboard";

function App() {
  const [department, setDepartment] = useState(null);

  const handleLogin = (selectedDepartment) => {
    setDepartment(selectedDepartment);
  };

  if (!department) {
    return <Login onLogin={handleLogin} />;
  }

  if (department === "snt" || department === "S&T") {
    return <STDashboard />;
  }

  return <Dashboard />;
}

export default App;