"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "./Toast";
import { openAuthModal } from "./AuthModal";

type Review = {
  id: string;
  rating: number;
  title: string;
  body: string;
  verifiedPurchase: boolean;
  createdAt: string;
  reviewerName: string;
};

type Summary = {
  average: number;
  count: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
};

type Props = {
  productId: string;
  initialReviews: Review[];
  initialSummary: Summary;
  canReview: boolean;
  verifiedBuyer: boolean;
};

function Stars({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <span
      className="inline-flex text-gold"
      style={{ fontSize: size }}
      aria-label={`${value} out of 5 stars`}
    >
      {"★".repeat(Math.round(value))}
      <span className="text-mist">{"★".repeat(5 - Math.round(value))}</span>
    </span>
  );
}

export function ReviewSection({
  productId,
  initialReviews,
  initialSummary,
  canReview,
  verifiedBuyer,
}: Props) {
  const { user } = useAuth();
  const { show } = useToast();
  const [reviews, setReviews] = useState(initialReviews);
  const [summary, setSummary] = useState(initialSummary);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Refresh after login
  useEffect(() => {
    if (canReview) setShowForm(false);
  }, [canReview]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, title, body }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        const newReview: Review = {
          id: data.review.id,
          rating: data.review.rating,
          title: data.review.title,
          body: data.review.body,
          verifiedPurchase: data.review.verifiedPurchase,
          createdAt: new Date(data.review.createdAt).toISOString(),
          reviewerName: user?.fullName ?? "Aura customer",
        };
        const newReviews = [newReview, ...reviews];
        setReviews(newReviews);
        const dist = { ...summary.distribution };
        dist[rating as 1 | 2 | 3 | 4 | 5] += 1;
        const total = newReviews.reduce((s, r) => s + r.rating, 0);
        setSummary({
          average: total / newReviews.length,
          count: newReviews.length,
          distribution: dist,
        });
        setTitle("");
        setBody("");
        setRating(5);
        setShowForm(false);
        show("Thanks for your review!", "success");
      } else {
        show(data.error ?? "Could not submit review.", "error");
      }
    } catch {
      show("Network error. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-12">
      <h2 className="font-display text-3xl font-semibold tracking-tight text-ink">
        Reviews
      </h2>

      {summary.count === 0 ? (
        <p className="mt-3 text-ink-soft">
          No reviews yet—be the first to share your experience.
        </p>
      ) : (
        <div className="mt-5 grid gap-8 lg:grid-cols-[260px_1fr]">
          <div className="rounded-2xl bg-white/60 p-5 ring-1 ring-black/5">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-5xl font-semibold text-moss">
                {summary.average.toFixed(1)}
              </span>
              <span className="text-ink-soft">/ 5</span>
            </div>
            <Stars value={summary.average} size={18} />
            <p className="mt-1 text-sm text-ink-soft">
              {summary.count} {summary.count === 1 ? "review" : "reviews"}
            </p>
            <div className="mt-4 space-y-1.5">
              {[5, 4, 3, 2, 1].map((n) => {
                const count = summary.distribution[n as 1 | 2 | 3 | 4 | 5];
                const pct = summary.count
                  ? (count / summary.count) * 100
                  : 0;
                return (
                  <div
                    key={n}
                    className="flex items-center gap-2 text-xs text-ink-soft"
                  >
                    <span className="w-6 shrink-0">{n}★</span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-mist">
                      <div
                        className="h-full rounded-full bg-gold"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-6 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <ul className="space-y-5">
            {reviews.map((r) => (
              <li key={r.id} className="rounded-2xl bg-white/60 p-5 ring-1 ring-black/5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Stars value={r.rating} />
                    <p className="mt-2 font-display text-base font-semibold text-ink">
                      {r.title}
                    </p>
                  </div>
                  {r.verifiedPurchase && (
                    <span className="rounded-full bg-sage/15 px-2.5 py-1 text-[11px] font-semibold text-sage-deep">
                      Verified buyer
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-ink-soft">{r.body}</p>
                <p className="mt-3 text-xs text-ink-soft">
                  — {r.reviewerName},{" "}
                  {new Date(r.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8">
        {canReview ? (
          verifiedBuyer ? (
            showForm ? (
              <form
                onSubmit={submit}
                className="rounded-2xl bg-white/70 p-5 ring-1 ring-black/5"
              >
                <h3 className="font-display text-lg font-semibold text-ink">
                  Share your experience
                </h3>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-sm text-ink">Your rating:</span>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      className={`text-2xl transition ${
                        n <= rating ? "text-gold" : "text-mist"
                      }`}
                      aria-label={`Rate ${n} stars`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <label className="mt-4 block text-sm font-medium text-ink">
                  Review title
                </label>
                <input
                  type="text"
                  required
                  maxLength={120}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 w-full rounded-lg bg-white px-3 py-2.5 text-base text-ink ring-1 ring-black/10 outline-none focus:ring-2 focus:ring-sage"
                  placeholder="A cozy, clean burn"
                />
                <label className="mt-3 block text-sm font-medium text-ink">
                  Your review
                </label>
                <textarea
                  required
                  maxLength={2000}
                  rows={4}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="mt-1 w-full rounded-lg bg-white px-3 py-2.5 text-base text-ink ring-1 ring-black/10 outline-none focus:ring-2 focus:ring-sage"
                  placeholder="What did you love about this scent?"
                />
                <div className="mt-4 flex gap-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-full bg-moss px-5 py-2.5 text-sm font-semibold text-cream-soft transition hover:bg-sage-deep disabled:opacity-60"
                  >
                    {submitting ? "Submitting…" : "Post review"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink ring-1 ring-black/10 transition hover:bg-cream-soft"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setShowForm(true)}
                className="rounded-full bg-moss px-5 py-2.5 text-sm font-semibold text-cream-soft transition hover:bg-sage-deep"
              >
                Write a review
              </button>
            )
          ) : (
            <p className="rounded-2xl bg-mist/50 px-5 py-4 text-sm text-ink-soft">
              Only verified buyers can leave a review. Purchase this candle to
              share your thoughts.
            </p>
          )
        ) : (
          <button
            onClick={() => openAuthModal("login")}
            className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink ring-1 ring-black/10 transition hover:bg-cream-soft"
          >
            Sign in to leave a review
          </button>
        )}
      </div>
    </div>
  );
}
