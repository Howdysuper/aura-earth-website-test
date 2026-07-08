import "server-only";
import { cookies } from "next/headers";
import { isAdminConfigured, getAdminAuth } from "./firebase-admin";
import { getUserById, createUser } from "./firestore";

export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  createdAt?: Date;
};

const SESSION_COOKIE = "firebase-session";
const USER_COOKIE = "firebase-user";

/**
 * Verify the current user from session cookies.
 * When Admin SDK is configured, verifies the Firebase ID token.
 * Otherwise, reads the user profile from a signed cookie.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const store = await cookies();

    if (isAdminConfigured()) {
      // Admin SDK available — verify the ID token
      const token = store.get(SESSION_COOKIE)?.value;
      if (!token) return null;
      const decoded = await getAdminAuth().verifyIdToken(token);
      const user = await getUserById(decoded.uid);
      if (!user) return null;
      return { id: user.id, email: user.email, fullName: user.fullName, createdAt: user.createdAt };
    }

    // No Admin SDK — read user from cookie (set by client after Firebase Auth)
    const userJson = store.get(USER_COOKIE)?.value;
    if (!userJson) return null;
    const user = JSON.parse(userJson) as AuthUser;
    return user;
  } catch {
    return null;
  }
}

/**
 * Set the Firebase ID token as a session cookie.
 */
export async function setSessionCookie(token: string): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
}

/**
 * Set user profile cookie (used when Admin SDK is not available).
 */
export async function setUserCookie(user: AuthUser): Promise<void> {
  const store = await cookies();
  store.set(USER_COOKIE, JSON.stringify(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
}

/**
 * Clear all session cookies.
 */
export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  store.delete(USER_COOKIE);
}

/**
 * Create a user profile in Firestore after Firebase Auth signup.
 */
export async function signup(data: {
  uid: string;
  email: string;
  fullName: string;
}): Promise<AuthUser> {
  try {
    const existing = await getUserById(data.uid);
    if (existing) {
      return { id: existing.id, email: existing.email, fullName: existing.fullName, createdAt: existing.createdAt };
    }
    return createUser(data.uid, data.email, data.fullName);
  } catch {
    // Admin SDK not configured — return a local user object
    return { id: data.uid, email: data.email, fullName: data.fullName, createdAt: new Date() };
  }
}

/**
 * Verify a user exists in Firestore after Firebase Auth login.
 */
export async function login(uid: string): Promise<AuthUser | null> {
  try {
    const user = await getUserById(uid);
    if (!user) return null;
    return { id: user.id, email: user.email, fullName: user.fullName, createdAt: user.createdAt };
  } catch {
    return null;
  }
}
