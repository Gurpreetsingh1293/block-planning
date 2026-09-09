import { useState } from "react";
import "./Login.css";

// =====================================================
// REPLACE THIS IMAGE:
// Place the desired railway/Vande Bharat image at:
// frontend/src/assets/images/vande-bharat.jpg
// (Replace the file directly — this import path never
// needs to change unless you rename the file itself.)
// =====================================================
import vandeBharatImage from "../assets/images/vande-bharat.jpg";

// Department values used across the app for future routing.
// Keep these exact strings in sync with any routing/dashboard code.
const DEPARTMENTS = [
  { value: "engineering", label: "Engineering" },
  { value: "snt", label: "Signal & Telecommunication (S&T)" },
  { value: "traction", label: "Traction Distribution" },
];

// -----------------------------------------------------
// Mock authentication (frontend-only placeholder)
// Replace this function with a real API call, e.g.:
//   const res = await apiClient.post("/auth/login", { userId, password });
// Keep the same input/output shape so callers below don't change.
// -----------------------------------------------------
function mockAuthenticate(userId, password) {
  // TODO: connect to backend authentication endpoint.
  // For now, any non-empty userId/password is treated as valid.
  return Boolean(userId.trim()) && Boolean(password.trim());
}

// -----------------------------------------------------
// Google login placeholder.
// Isolated on purpose so real Google OAuth can be dropped
// in here later without touching the rest of the page.
// -----------------------------------------------------
function handleGoogleLogin() {
  // TODO: implement real Google OAuth (e.g. Google Identity Services).
  // Do NOT simulate a successful login here.
  console.log("Google login clicked - OAuth not yet implemented.");
}

export default function Login() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [error, setError] = useState("");

  function handleLogin(e) {
    e.preventDefault();
    setError("");

    if (!userId.trim()) {
      setError("Please enter your User ID.");
      return;
    }
    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }
    if (!department) {
      setError("Please select your department.");
      return;
    }

    const isAuthenticated = mockAuthenticate(userId, password);
    if (!isAuthenticated) {
      setError("Invalid User ID or password.");
      return;
    }

    // ==================================================
    // FUTURE DEPARTMENT ROUTING
    // engineering → Engineering Dashboard
    // snt         → S&T Dashboard
    // traction    → Traction Dashboard
    //
    // Once React Router (or similar) is added, replace the
    // block below with actual navigation, e.g.:
    //
    //   const routes = {
    //     engineering: "/dashboard/engineering",
    //     snt: "/dashboard/snt",
    //     traction: "/dashboard/traction",
    //   };
    //   navigate(routes[department]);
    // ==================================================
    console.log("Login successful. Department selected:", department);
    console.log("Route to the appropriate dashboard here.");
  }

  return (
    <div className="login-page">
      <section className="login-panel">
        <div className="login-panel-inner">
          <div className="brand">
            <span className="brand-mark">RBP</span>
            <span className="brand-name">Railway Block Planning</span>
          </div>

          <h1 className="login-heading">Welcome back</h1>
          <p className="login-subtitle">
            Intelligent maintenance block planning for safer and more
            reliable train operations.
          </p>

          <button
            type="button"
            className="google-btn"
            onClick={handleGoogleLogin}
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <div className="divider">
            <span>or sign in with User ID</span>
          </div>

          <form className="login-form" onSubmit={handleLogin} noValidate>
            <div className="field">
              <label htmlFor="userId">User ID</label>
              <input
                id="userId"
                name="userId"
                type="text"
                autoComplete="username"
                placeholder="Enter your railway user ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="department">Department</label>
              <select
                id="department"
                name="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option value="" disabled>
                  Select your department
                </option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept.value} value={dept.value}>
                    {dept.label}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}

            <button type="submit" className="login-btn">
              Log In
            </button>
          </form>
        </div>
      </section>

      <section className="image-panel" aria-hidden="true">
        <img
          src={vandeBharatImage}
          alt=""
          className="image-panel-photo"
        />
        <div className="image-panel-overlay">
          <h2>INDIAN RAILWAYS</h2>
          <p>Safety • Security • Punctuality</p>
        </div>
      </section>
    </div>
  );
}

// Small inline icon so no icon library dependency is needed.
function GoogleIcon() {
  return (
    <svg
      className="google-icon"
      viewBox="0 0 18 18"
      width="18"
      height="18"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.55-1.85.87-3.04.87-2.34 0-4.32-1.58-5.03-3.7H.98v2.33A9 9 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.73A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.19.29-1.73V4.94H.98A9 9 0 0 0 0 9c0 1.45.35 2.83.98 4.06l2.99-2.33z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.47.89 11.43 0 9 0A9 9 0 0 0 .98 4.94l2.99 2.33C4.68 5.16 6.66 3.58 9 3.58z"
      />
    </svg>
  );
}