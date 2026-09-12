/**
 * firebase.js
 *
 * Initialises Firebase and exports `auth` + `googleProvider`.
 *
 * SECURITY: The Firebase config is read exclusively from Vite environment
 * variables (import.meta.env.VITE_*).  No values are ever hardcoded here.
 *
 * Fill in the real values in frontend/.env (already covered by .gitignore).
 * See frontend/.env.example for the required variable names.
 *
 * If any required env var is missing (e.g. dev server started before .env was
 * written), Firebase initialisation is skipped and `auth` is exported as null.
 * The app will still render; Google Sign-In will be unavailable but the legacy
 * Railway ID login will continue to work.
 */

import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const {
  VITE_FIREBASE_API_KEY:            apiKey,
  VITE_FIREBASE_AUTH_DOMAIN:        authDomain,
  VITE_FIREBASE_PROJECT_ID:         projectId,
  VITE_FIREBASE_STORAGE_BUCKET:     storageBucket,
  VITE_FIREBASE_MESSAGING_SENDER_ID: messagingSenderId,
  VITE_FIREBASE_APP_ID:             appId,
} = import.meta.env;

// Guard: only initialise if all required values are present and non-empty.
const allConfigPresent =
  apiKey && authDomain && projectId && storageBucket && messagingSenderId && appId;

let auth = null;
let googleProvider = null;

if (allConfigPresent) {
  try {
    // Avoid re-initialising if the module is evaluated more than once (HMR).
    const app = getApps().length === 0
      ? initializeApp({ apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId })
      : getApps()[0];

    auth           = getAuth(app);
    googleProvider = new GoogleAuthProvider();
  } catch (err) {
    console.error("[Firebase] Initialisation failed:", err.message);
    // auth and googleProvider stay null — app remains functional without Firebase.
  }
} else {
  console.warn(
    "[Firebase] One or more VITE_FIREBASE_* env vars are missing. " +
    "Google Sign-In will be unavailable. " +
    "Restart the dev server after filling in frontend/.env."
  );
}

export { auth, googleProvider };
