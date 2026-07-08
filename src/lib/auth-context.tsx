"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type Auth,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  createdAt?: Date;
};

type AuthContextValue = {
  user: AuthUser | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  setUser: (u: AuthUser | null) => void;
  login: (email: string, password: string) => Promise<AuthUser>;
  signup: (email: string, password: string, fullName: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const data = await res.json();
      setUser(data.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth as unknown as Auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          const token = await fbUser.getIdToken();
          // Send token + user profile to server
          await fetch("/api/auth/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              token,
              user: {
                id: fbUser.uid,
                email: fbUser.email ?? "",
                fullName: fbUser.displayName ?? fbUser.email?.split("@")[0] ?? "User",
              },
            }),
          });
          // Fetch full profile from server
          const res = await fetch("/api/auth/me", { cache: "no-store" });
          const data = await res.json();
          setUser(data.user ?? null);
        } catch {
          setUser(null);
        }
      } else {
        await fetch("/api/auth/logout", { method: "POST" });
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const cred = await signInWithEmailAndPassword(auth as unknown as Auth, email, password);
    const token = await cred.user.getIdToken();
    await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        user: {
          id: cred.user.uid,
          email: cred.user.email ?? "",
          fullName: cred.user.displayName ?? email.split("@")[0],
        },
      }),
    });
    const res = await fetch("/api/auth/me", { cache: "no-store" });
    const data = await res.json();
    const u = data.user as AuthUser;
    setUser(u);
    return u;
  }, []);

  const signup = useCallback(
    async (email: string, password: string, fullName: string) => {
      const cred = await createUserWithEmailAndPassword(auth as unknown as Auth, email, password);
      const token = await cred.user.getIdToken();
      // Set session and create profile
      await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          user: { id: cred.user.uid, email, fullName },
        }),
      });
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: cred.user.uid, email, fullName }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "Sign up failed.");
      }
      setUser(data.user);
      return data.user as AuthUser;
    },
    [],
  );

  const logout = useCallback(async () => {
    await signOut(auth as unknown as Auth);
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setFirebaseUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, firebaseUser, loading, setUser, login, signup, logout, refresh }),
    [user, firebaseUser, loading, login, signup, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
