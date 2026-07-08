"use client";

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const isClient = typeof window !== "undefined";

let app: FirebaseApp | null = null;
let _db: Firestore | null = null;
let _authInstance: unknown = null;
let _googleProvider: unknown = null;

function getApp(): FirebaseApp {
  if (!app) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  }
  return app;
}

export function getFirebaseDb(): Firestore {
  if (!_db) _db = getFirestore(getApp());
  return _db;
}

async function ensureAuth() {
  if (_authInstance) return _authInstance;
  if (!isClient) return null;
  const { getAuth } = await import("firebase/auth");
  _authInstance = getAuth(getApp());
  return _authInstance;
}

async function ensureGoogleProvider() {
  if (_googleProvider) return _googleProvider;
  if (!isClient) return null;
  const { GoogleAuthProvider } = await import("firebase/auth");
  _googleProvider = new GoogleAuthProvider();
  return _googleProvider;
}

// Lazy proxies that defer firebase/auth import to runtime
export const db = new Proxy({} as Firestore, {
  get(_, prop) {
    if (!isClient) return undefined;
    return (getFirebaseDb() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

// Auth proxy - initializes lazily on first property access (client only)
export const auth = new Proxy({} as Record<string, unknown>, {
  get(_, prop) {
    if (!isClient) return undefined;
    if (!_authInstance) {
      // Use require for synchronous init on client
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { getAuth } = require("firebase/auth");
      _authInstance = getAuth(getApp());
    }
    return (_authInstance as Record<string | symbol, unknown>)[prop];
  },
});

export const googleProvider = new Proxy({} as Record<string, unknown>, {
  get(_, prop) {
    if (!isClient) return undefined;
    if (!_googleProvider) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { GoogleAuthProvider } = require("firebase/auth");
      _googleProvider = new GoogleAuthProvider();
    }
    return (_googleProvider as Record<string | symbol, unknown>)[prop];
  },
});
