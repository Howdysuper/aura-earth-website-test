"use client";

import { useState, type FormEvent } from "react";
import { useToast } from "./Toast";

export function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    topic: "General",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const { show } = useToast();

  async function submit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        show(data.message ?? "Message sent!", "success");
        setForm({ name: "", email: "", topic: "General", message: "" });
      } else {
        show(data.error ?? "Could not send.", "error");
      }
    } catch {
      show("Network error.", "error");
    } finally {
      setStatus("loading");
      setTimeout(() => setStatus("idle"), 50);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">
            Your name
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-xl bg-white px-4 py-3 text-base text-ink ring-1 ring-black/10 outline-none focus:ring-2 focus:ring-sage"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">
            Email
          </label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-xl bg-white px-4 py-3 text-base text-ink ring-1 ring-black/10 outline-none focus:ring-2 focus:ring-sage"
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-ink">
          What&apos;s this about?
        </label>
        <select
          value={form.topic}
          onChange={(e) => setForm({ ...form, topic: e.target.value })}
          className="w-full rounded-xl bg-white px-4 py-3 text-base text-ink ring-1 ring-black/10 outline-none focus:ring-2 focus:ring-sage"
        >
          <option>General</option>
          <option>Order help</option>
          <option>Wholesale</option>
          <option>Press</option>
          <option>Subscriptions</option>
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-ink">
          Message
        </label>
        <textarea
          required
          minLength={5}
          maxLength={4000}
          rows={6}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full rounded-xl bg-white px-4 py-3 text-base text-ink ring-1 ring-black/10 outline-none focus:ring-2 focus:ring-sage"
          placeholder="Tell us what's on your mind…"
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-full bg-moss px-7 py-3.5 text-sm font-semibold text-cream-soft transition hover:bg-sage-deep disabled:opacity-60"
      >
        {status === "loading" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
