import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth, signInAnonymously } from 'firebase/auth';

const app = initializeApp({
  apiKey:      import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:  `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId:   import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId:       import.meta.env.VITE_FIREBASE_APP_ID,
});

export const db   = getDatabase(app);
export const auth = getAuth(app);

let _ready = null;

export function ensureAuth() {
  if (!_ready) _ready = signInAnonymously(auth).then(c => c.user);
  return _ready;
}
