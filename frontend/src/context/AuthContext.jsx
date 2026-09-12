/**
 * AuthContext.jsx
 *
 * React context that wraps the entire app, tracks the Firebase auth state
 * via onAuthStateChanged, and exposes { user, loading, signOut } to any
 * child that calls useAuth().
 *
 * Two auth paths are supported:
 *   1. Firebase Google Sign-In  — primary path, tracked via onAuthStateChanged.
 *   2. Legacy Railway ID login  — demo/fallback path via localStorage session
 *      (handled by api/client.js loginUser).  When no Firebase user is present
 *      but a legacy session exists, it is surfaced through this context as well.
 *
 * The `user` object exposed by this context is either:
 *   • A Firebase User merged with `roleInfo` (Google path), or
 *   • The legacy user object from localStorage merged with `roleInfo` (legacy path).
 */

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "../firebase";
import { getStoredUser, logoutUser } from "../api/client";

const AuthContext = createContext(null);

// ---------------------------------------------------------------------------
// ⚠️  TEMPORARY HACKATHON / DEMO ROLE ASSIGNMENT ⚠️
//
// Every Google account that successfully signs in is unconditionally assigned
// the role "S&T Officer" in the Signal & Telecommunication department.
//
// This is NOT production logic.  In a real deployment this must be replaced
// with a proper role lookup — e.g. a GET /api/users/{email}/role call to the
// backend/, keyed against the users table in database/ — so that each
// officer's actual department and designation is returned based on their
// identity rather than being hardcoded here.
// ---------------------------------------------------------------------------
function buildFirebaseRoleInfo() {
  return {
    role:           "S&T Officer",
    department:     "Signal & Telecommunication (S&T)",
    // Short code used by existing department-branching logic in App.jsx
    departmentCode: "snt",
    authMethod:     "google",
  };
}

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(undefined); // undefined = not yet resolved
  const [loading, setLoading]           = useState(true);
  // Legacy localStorage session (Railway ID login)
  const [legacyUser, setLegacyUser]     = useState(() => getStoredUser());

  useEffect(() => {
    // If Firebase didn't initialise (missing env vars), skip auth listener.
    // Legacy localStorage session will still work.
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      setFirebaseUser(fbUser);
      setLoading(false);
    });
    return unsubscribe; // cleanup on unmount
  }, []);

  // Build the unified user object for consumers.
  // Firebase Google user takes priority over legacy localStorage session.
  let user = null;
  if (firebaseUser) {
    user = {
      ...firebaseUser,
      // Convenience aliases so existing components that read user.userId / user.department work
      userId:     firebaseUser.email,
      name:       firebaseUser.displayName,
      roleInfo:   buildFirebaseRoleInfo(),
      department: "snt", // matches existing dept-branch logic
    };
  } else if (legacyUser) {
    user = legacyUser;
  }

  /** Called by legacy Login form after a successful Railway ID login */
  function setLegacySession(userData) {
    const u = typeof userData === "string"
      ? { department: userData.toLowerCase() }
      : userData;
    setLegacyUser(u);
  }

  async function signOut() {
    // Sign out from Firebase (no-op if Firebase isn't initialised)
    if (auth) {
      await firebaseSignOut(auth);
    }
    // Clear legacy session too
    logoutUser();
    setLegacyUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut, setLegacySession }}>
      {children}
    </AuthContext.Provider>
  );
}

/** Convenience hook. Must be used inside <AuthProvider>. */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === null) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
