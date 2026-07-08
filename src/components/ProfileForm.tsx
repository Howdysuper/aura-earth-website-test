"use client";

import { useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "./Toast";

export function ProfileForm({ initialName }: { initialName: string }) {
  const { user, refresh } = useAuth();
  const [fullName, setFullName] = useState(initialName);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const { show } = useToast();

  async function save(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        await refresh();
        show("Profile updated", "success");
      } else {
        setError(data.error ?? "Could not save.");
      }
    } catch {
      setError("Network error.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={save}
      className="rounded-2xl bg-white/70 p-5 ring-1 ring-black/5"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-ink">
            Full name
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-lg bg-white px-3 py-2.5 text-base text-ink ring-1 ring-black/10 outline-none focus:ring-2 focus:ring-sage"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-ink">
            Email
          </label>
          <input
            type="email"
            disabled
            value={user?.email ?? ""}
            className="w-full cursor-not-allowed rounded-lg bg-mist/60 px-3 py-2.5 text-base text-ink-soft ring-1 ring-black/5"
          />
          <p className="mt-1 text-xs text-ink-soft">
            Email changes are not supported in this demo.
          </p>
        </div>
      </div>
      {error && (
        <p
          role="alert"
          className="mt-3 rounded-lg bg-clay/10 px-3 py-2 text-sm font-medium text-clay"
        >
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={saving}
        className="mt-4 rounded-full bg-moss px-5 py-2.5 text-sm font-semibold text-cream-soft transition hover:bg-sage-deep disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
