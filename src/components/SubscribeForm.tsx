"use client";

import { useState, type FormEvent } from "react";

type SubscribeFormProps = {
  plan?: string;
  source?: string;
  cta?: string;
  placeholder?: string;
  variant?: "light" | "dark";
  className?: string;
};

export function SubscribeForm({
  plan = "newsletter",
  source = "landing",
  cta = "Join the list",
  placeholder = "you@email.com",
  variant = "light",
  className = "",
}: SubscribeFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, plan, source }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setStatus("ok");
        setMessage(data.message ?? "You're in!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  const isDark = variant === "dark";

  return (
    <div className={className}>
      <form
        onSubmit={handleSubmit}
        className={`flex flex-col gap-2.5 sm:flex-row sm:items-center sm:rounded-full sm:p-1.5 ${
          isDark
            ? "sm:bg-white/10 sm:ring-1 sm:ring-white/15"
            : "sm:bg-white sm:shadow-[var(--shadow-soft)] sm:ring-1 sm:ring-black/5"
        }`}
      >
        <label htmlFor={`email-${source}`} className="sr-only">
          Email address
        </label>
        <input
          id={`email-${source}`}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          className={`w-full flex-1 rounded-full px-5 py-3.5 text-base outline-none transition placeholder:text-current/45 sm:bg-transparent ${
            isDark
              ? "bg-white/10 text-white placeholder:text-white/50 ring-1 ring-white/15 focus:ring-white/40 sm:ring-0"
              : "bg-white text-ink ring-1 ring-black/10 focus:ring-sage sm:ring-0"
          }`}
          aria-describedby={`status-${source}`}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="group inline-flex items-center justify-center gap-2 rounded-full bg-moss px-6 py-3.5 text-sm font-semibold text-cream-soft shadow-[var(--shadow-soft)] transition-all duration-300 hover:bg-sage-deep hover:shadow-[var(--shadow-lift)] active:scale-[0.98] disabled:opacity-60"
        >
          {status === "loading" ? "Joining…" : cta}
          <span className="transition-transform duration-300 group-hover:translate-x-0.5">
            →
          </span>
        </button>
      </form>
      <p
        id={`status-${source}`}
        aria-live="polite"
        className={`mt-2.5 min-h-5 px-2 text-sm ${
          status === "error"
            ? "text-clay"
            : isDark
              ? "text-white/80"
              : "text-sage-deep"
        }`}
      >
        {message}
      </p>
    </div>
  );
}
