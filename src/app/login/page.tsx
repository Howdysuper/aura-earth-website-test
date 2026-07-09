"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const { user, loading, login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.replace(redirect);
    }
  }, [user, loading, redirect, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await login(form.email, form.password);
      router.replace(redirect);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid email or password.");
    } finally {
      setSubmitting(false);
    }
  }

  // Show nothing while checking auth state
  if (loading || user) {
    return (
      <main className="grid min-h-screen place-items-center bg-cream">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-moss border-t-transparent" />
      </main>
    );
  }

  return (
    <main className="grid min-h-screen place-items-center bg-cream px-5">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <span className="font-display text-2xl font-semibold text-ink">
              Aura &amp; Earth
            </span>
          </Link>
        </div>

        <div className="rounded-[var(--radius-xl2)] bg-cream-soft p-7 shadow-[var(--shadow-lift)] sm:p-8">
          <h1 className="font-display text-2xl font-semibold text-ink">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            Sign in to view orders, your wishlist, and exclusive perks.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-3">
            <div>
              <label
                htmlFor="login-email"
                className="mb-1.5 block text-sm font-medium text-ink"
              >
                Email
              </label>
              <input
                id="login-email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl bg-white px-4 py-3 text-base text-ink ring-1 ring-black/10 outline-none transition focus:ring-2 focus:ring-sage"
                autoComplete="email"
                autoFocus
              />
            </div>
            <div>
              <label
                htmlFor="login-password"
                className="mb-1.5 block text-sm font-medium text-ink"
              >
                Password
              </label>
              <input
                id="login-password"
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full rounded-xl bg-white px-4 py-3 text-base text-ink ring-1 ring-black/10 outline-none transition focus:ring-2 focus:ring-sage"
                autoComplete="current-password"
              />
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
              disabled={submitting}
              className="mt-2 w-full rounded-full bg-moss px-5 py-3.5 text-sm font-semibold text-cream-soft transition-all duration-300 hover:bg-sage-deep disabled:opacity-60"
            >
              {submitting ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-ink-soft">
            New to Aura &amp; Earth?{" "}
            <Link
              href="/shop"
              className="font-semibold text-moss underline-offset-2 hover:underline"
            >
              Browse the collection
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-ink-soft">
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
    </main>
  );
}
