"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "./Toast";

type Mode = "login" | "signup";

export function AuthModal() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("login");
  const { login, signup } = useAuth();
  const { show } = useToast();
  const [form, setForm] = useState({ email: "", password: "", fullName: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  // Expose a global hook for components that don't have provider access.
  useEffect(() => {
    (window as unknown as { __openAuth?: (m: Mode) => void }).__openAuth = (
      m: Mode = "login",
    ) => {
      setMode(m);
      setOpen(true);
    };
    return () => {
      delete (window as unknown as { __openAuth?: unknown }).__openAuth;
    };
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (mode === "login") {
        await login(form.email, form.password);
        show("Welcome back ✨", "success");
      } else {
        await signup(form.email, form.password, form.fullName);
        show("Account created—welcome to Aura & Earth", "success");
      }
      setOpen(false);
      setForm({ email: "", password: "", fullName: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function switchMode(next: Mode) {
    setMode(next);
    setError("");
  }

  return (
    <div
      className={`fixed inset-0 z-[70] transition-all duration-300 ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!open}
    >
      <div
        className={`absolute inset-0 bg-ink/50 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => setOpen(false)}
      />
      <div
        className={`absolute left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-xl2)] bg-cream-soft p-7 shadow-[var(--shadow-lift)] transition-all duration-500 ${
          open ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        role="dialog"
        aria-label={mode === "login" ? "Sign in" : "Create an account"}
      >
        <button
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-ink-soft transition hover:bg-black/5"
        >
          ✕
        </button>
        <h2 className="font-display text-2xl font-semibold text-ink">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h2>
        <p className="mt-1 text-sm text-ink-soft">
          {mode === "login"
            ? "Sign in to view orders, your wishlist, and exclusive perks."
            : "Save your wishlist, track orders, and check out faster."}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          {mode === "signup" && (
            <div>
              <label
                htmlFor="auth-name"
                className="mb-1.5 block text-sm font-medium text-ink"
              >
                Full name
              </label>
              <input
                id="auth-name"
                type="text"
                required
                value={form.fullName}
                onChange={(e) =>
                  setForm({ ...form, fullName: e.target.value })
                }
                className="w-full rounded-xl bg-white px-4 py-3 text-base text-ink ring-1 ring-black/10 outline-none transition focus:ring-2 focus:ring-sage"
                autoComplete="name"
              />
            </div>
          )}
          <div>
            <label
              htmlFor="auth-email"
              className="mb-1.5 block text-sm font-medium text-ink"
            >
              Email
            </label>
            <input
              id="auth-email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-xl bg-white px-4 py-3 text-base text-ink ring-1 ring-black/10 outline-none transition focus:ring-2 focus:ring-sage"
              autoComplete="email"
            />
          </div>
          <div>
            <label
              htmlFor="auth-password"
              className="mb-1.5 block text-sm font-medium text-ink"
            >
              Password
            </label>
            <input
              id="auth-password"
              type="password"
              required
              minLength={mode === "signup" ? 8 : 1}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-xl bg-white px-4 py-3 text-base text-ink ring-1 ring-black/10 outline-none transition focus:ring-2 focus:ring-sage"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
            {mode === "signup" && (
              <p className="mt-1 text-xs text-ink-soft">8+ characters</p>
            )}
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-xl bg-clay/10 px-3 py-2 text-sm font-medium text-clay"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-full bg-moss px-5 py-3.5 text-sm font-semibold text-cream-soft transition-all duration-300 hover:bg-sage-deep disabled:opacity-60"
          >
            {loading
              ? mode === "login"
                ? "Signing in…"
                : "Creating account…"
              : mode === "login"
                ? "Sign in"
                : "Create account"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-ink-soft">
          {mode === "login" ? (
            <>
              New to Aura &amp; Earth?{" "}
              <button
                onClick={() => switchMode("signup")}
                className="font-semibold text-moss underline-offset-2 hover:underline"
              >
                Create an account
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => switchMode("login")}
                className="font-semibold text-moss underline-offset-2 hover:underline"
              >
                Sign in
              </button>
            </>
          )}
        </p>

        <p className="mt-4 text-center text-xs text-ink-soft">
          By continuing you agree to our{" "}
          <Link href="/legal/terms" className="underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/legal/privacy" className="underline">
            Privacy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

export function openAuthModal(mode: Mode = "login") {
  const w = window as unknown as { __openAuth?: (m: Mode) => void };
  w.__openAuth?.(mode);
}
