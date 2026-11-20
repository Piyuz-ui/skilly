// Firebase settings come from environment variables (see .env.example), so
// the same code runs locally, against the emulators and in production.
// These web keys are not secrets: they only identify the project. What a
// signed-in user may read or write is enforced by firestore.rules.
const env = import.meta.env;

export const FIREBASE_CONFIG = {
  apiKey: env.VITE_FIREBASE_API_KEY || '',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: env.VITE_FIREBASE_PROJECT_ID || '',
  appId: env.VITE_FIREBASE_APP_ID || '',
};

// '1' = use the local Firebase emulators (npm run emulators).
export const USE_EMULATORS = env.VITE_FIREBASE_EMULATORS === '1';

export const accountsEnabled = Boolean(FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.projectId);

let loaded = null;

// The Firebase SDK is loaded only when it's needed (someone opens the account
// page, or was signed in last time), so first visits stay fast.
export function loadFirebase() {
  if (!accountsEnabled) return Promise.reject(new Error('accounts-off'));
  if (loaded) return loaded;
  loaded = (async () => {
    const [{ initializeApp }, authMod, fsMod] = await Promise.all([
      import('firebase/app'),
      import('firebase/auth'),
      import('firebase/firestore'),
    ]);
    const app = initializeApp(FIREBASE_CONFIG);
    const auth = authMod.getAuth(app);
    auth.useDeviceLanguage();
    const db = fsMod.getFirestore(app);
    if (USE_EMULATORS) {
      authMod.connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
      fsMod.connectFirestoreEmulator(db, '127.0.0.1', 8080);
      auth.settings.appVerificationDisabledForTesting = true;
    }
    return { app, auth, db, A: authMod, F: fsMod };
  })();
  loaded.catch(() => { loaded = null; });
  return loaded;
}
