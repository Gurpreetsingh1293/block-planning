import { useState } from "react";
import "./Login.css";
import vandeBharatImage from "../assets/images/vande-bharat.jpg";
import { loginUser } from "../api/client";

const DEPARTMENTS = [
  {
    value: "engineering",
    label: "Engineering (Civil / Track P-Way)",
    code: "ENG",
  },
  {
    value: "snt",
    label: "Signal & Telecommunication (S&T)",
    code: "S&T",
  },
  {
    value: "traction",
    label: "Traction Distribution (TRD / OHE)",
    code: "TRD",
  },
];

const DEMO_OFFICER_PRESETS = [
  {
    label: "Engineering (ENG001)",
    userId: "ENG001",
    department: "engineering",
    badge: "P-Way",
  },
  {
    label: "S&T (SNT001)",
    userId: "SNT001",
    department: "snt",
    badge: "Signal & Telecom",
  },
  {
    label: "Traction (TRD001)",
    userId: "TRD001",
    department: "traction",
    badge: "OHE / Electrical",
  },
];

export default function Login({ onLogin }) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleQuickFill(preset) {
    setUserId(preset.userId);
    setPassword("railway@123");
    setDepartment(preset.department);
    setError("");
    setSuccess(null);
  }

  function handleGoogleLogin() {
    console.log(
      "[RBP Auth] Google OAuth clicked - reserved for future implementation."
    );

    setError(
      "Google authentication will be connected in a future update. Please sign in with your Railway User ID."
    );
  }

  async function handleLogin(e) {
    e.preventDefault();

    setError("");
    setSuccess(null);

    if (!userId.trim()) {
      setError("Please enter your Railway User ID.");
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }

    if (!department) {
      setError("Please select your railway department.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await loginUser({
        userId: userId.trim(),
        password: password.trim(),
        department,
      });

      console.log("[RBP Auth] Login successful:", result.user);

      /*
       * IMPORTANT:
       * Send the selected department to App.jsx.
       *
       * For S&T:
       * department = "snt"
       *
       * App.jsx will then render:
       * <STDashboard />
       */

      const loggedInDepartment =
        result?.user?.department?.toLowerCase() || department.toLowerCase();

      onLogin(loggedInDepartment);

    } catch (err) {
      console.error("[RBP Auth Error]:", err);

      setError(
        err.message ||
          "Failed to authenticate. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="login-page">
      <section className="login-panel">
        <div className="login-panel-inner">
          <div className="brand">
            <span className="brand-mark">IR</span>

            <div className="brand-details">
              <span className="brand-name">Indian Railways</span>
              <span className="brand-subtext">
                Intelligent Block Planning Portal
              </span>
            </div>
          </div>

          <h1 className="login-heading">Officer Login</h1>

          <p className="login-subtitle">
            Sign in with your Railway Department credentials to access
            maintenance block scheduling, AI conflict analysis, and slot
            allocations.
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
            <span>or sign in with Railway ID</span>
          </div>

          <div className="demo-fill-card">
            <span className="demo-card-title">
              Quick Fill Demo Accounts:
            </span>

            <div className="demo-buttons-row">
              {DEMO_OFFICER_PRESETS.map((preset) => (
                <button
                  key={preset.userId}
                  type="button"
                  className={`demo-btn ${
                    department === preset.department &&
                    userId === preset.userId
                      ? "active"
                      : ""
                  }`}
                  onClick={() => handleQuickFill(preset)}
                >
                  <span className="demo-btn-dept">{preset.badge}</span>
                  <span className="demo-btn-id">{preset.userId}</span>
                </button>
              ))}
            </div>
          </div>

          <form
            className="login-form"
            onSubmit={handleLogin}
            noValidate
          >
            <div className="field">
              <label htmlFor="userId">Railway User ID</label>

              <input
                id="userId"
                name="userId"
                type="text"
                autoComplete="username"
                placeholder="e.g. ENG001, SNT001, TRD001"
                value={userId}
                onChange={(e) => {
                  setUserId(e.target.value);

                  if (error) {
                    setError("");
                  }
                }}
                disabled={isLoading}
              />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter railway password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);

                  if (error) {
                    setError("");
                  }
                }}
                disabled={isLoading}
              />
            </div>

            <div className="field">
              <label htmlFor="department">Department</label>

              <select
                id="department"
                name="department"
                value={department}
                onChange={(e) => {
                  setDepartment(e.target.value);

                  if (error) {
                    setError("");
                  }
                }}
                disabled={isLoading}
              >
                <option value="" disabled>
                  -- Select Your Department --
                </option>

                {DEPARTMENTS.map((dept) => (
                  <option key={dept.value} value={dept.value}>
                    {dept.label}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <div className="form-error" role="alert">
                <span className="error-icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="form-success" role="status">
                <div className="success-header">
                  <span className="success-icon">✓</span>
                  <strong>{success.message}</strong>
                </div>

                <div className="success-details">
                  <p>
                    <strong>Officer:</strong> {success.officer.name}
                  </p>

                  <p>
                    <strong>Designation:</strong>{" "}
                    {success.officer.designation}
                  </p>

                  <p>
                    <strong>Department:</strong>{" "}
                    {success.officer.department.toUpperCase()}
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="login-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="btn-loading">
                  <span className="spinner"></span>
                  Verifying Credentials...
                </span>
              ) : (
                "Log In to Operations"
              )}
            </button>
          </form>
        </div>
      </section>

      <section className="image-panel" aria-hidden="true">
        <img
          src={vandeBharatImage}
          alt="Indian Railways Vande Bharat Express"
          className="image-panel-photo"
        />

        <div className="image-panel-overlay">
          <div className="overlay-pill">
            GOVERNMENT OF INDIA • MINISTRY OF RAILWAYS
          </div>

          <h2>Intelligent Block Planning System</h2>

          <p>
            Coordinated Multi-Department Corridor Maintenance for High-Speed &
            Freight Operations
          </p>

          <div className="dept-tags">
            <span className="dept-tag">Engineering (P-Way)</span>
            <span className="dept-tag">
              Signal & Telecom (S&T)
            </span>
            <span className="dept-tag">Traction (TRD)</span>
          </div>
        </div>
      </section>
    </div>
  );
}

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