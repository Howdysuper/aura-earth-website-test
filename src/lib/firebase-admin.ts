import { getApps, initializeApp, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getAuth, type Auth } from "firebase-admin/auth";

let adminApp: App | null = null;
let _adminDb: Firestore | null = null;
let _adminAuth: Auth | null = null;

function getAdminApp(): App | null {
  if (adminApp) return adminApp;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  // Only initialize if we have real credentials
  if (!clientEmail || !privateKey || privateKey.includes("YOUR_PRIVATE_KEY")) {
    return null;
  }

  try {
    if (getApps().length === 0) {
      adminApp = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, "\n"),
        }),
      });
    } else {
      adminApp = getApps()[0];
    }
    return adminApp;
  } catch {
    return null;
  }
}

export function getAdminDb(): Firestore {
  if (_adminDb) return _adminDb;
  const app = getAdminApp();
  if (!app) {
    throw new Error(
      "Firebase Admin SDK not configured. Add service account credentials to .env.local",
    );
  }
  _adminDb = getFirestore(app);
  return _adminDb;
}

export function getAdminAuth(): Auth {
  if (_adminAuth) return _adminAuth;
  const app = getAdminApp();
  if (!app) {
    throw new Error(
      "Firebase Admin SDK not configured. Add service account credentials to .env.local",
    );
  }
  _adminAuth = getAuth(app);
  return _adminAuth;
}

export function isAdminConfigured(): boolean {
  return getAdminApp() !== null;
}

// Lazy exports for backward compatibility
export const adminDb = new Proxy({} as Firestore, {
  get(_, prop) {
    return (getAdminDb() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export const adminAuth = new Proxy({} as Auth, {
  get(_, prop) {
    return (getAdminAuth() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
