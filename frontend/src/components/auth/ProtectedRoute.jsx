/**
 * ProtectedRoute.jsx
 *
 * Gate component for any route that requires an authenticated Firebase user.
 *
 * Behaviour:
 *   • loading  → render a full-screen spinner (auth state not yet resolved)
 *   • no user  → render the Login page
 *   • user     → render children (the actual page)
 */

import React from "react";
import { useAuth } from "../../context/AuthContext";
import LoginPage from "../../pages/Login";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display:         "flex",
          alignItems:      "center",
          justifyContent:  "center",
          height:          "100vh",
          background:      "#f9fafb",
          flexDirection:   "column",
          gap:             "16px",
          fontFamily:      "Inter, sans-serif",
        }}
        aria-busy="true"
        aria-label="Checking authentication…"
      >
        {/* Simple CSS spinner that matches the app's blue theme */}
        <div
          style={{
            width:          "44px",
            height:         "44px",
            border:         "4px solid #e5e7eb",
            borderTopColor: "#2563eb",
            borderRadius:   "50%",
            animation:      "spin 0.7s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <span style={{ color: "#6b7280", fontSize: "14px" }}>
          Verifying session…
        </span>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return <>{children}</>;
}
