"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

export type ReviewItem = {
  id: string;
  rating: number;
  title: string;
  body: string;
  verifiedPurchase: boolean;
  createdAt: string;
  reviewerName: string;
  productName: string;
  productSlug: string;
  productImage: string;
};

export type ReviewSummary = {
  average: number;
  count: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
};

function Stars({ value }: { value: number }) {
  return (
    <span
      className="inline-flex text-gold"
      aria-label={`${value} out of 5 stars`}
    >
      {"★".repeat(Math.round(value))}
      <span className="text-mist">{"★".repeat(5 - Math.round(value))}</span>
    </span>
  );
}

export function ReviewsExplorer({
  reviews,
  summary,
}: {
  reviews: ReviewItem[];
  summary: ReviewSummary;
}) {
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);

  const filtered = useMemo(
    () =>
      ratingFilter
        ? reviews.filter((r) => r.rating === ratingFilter)
        : reviews,
    [reviews, ratingFilter],
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      {/* Summary */}
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-2xl bg-white/70 p-6 ring-1 ring-black/5">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-5xl font-semibold text-moss">
              {summary.average.toFixed(1)}
            </span>
            <span className="text-ink-soft">/ 5</span>
          </div>
          <Stars value={summary.average} />
          <p className="mt-1 text-sm text-ink-soft">
            Based on{" "}
            <span className="font-semibold text-ink">{summary.count}</span>{" "}
            {summary.count === 1 ? "review" : "reviews"}
          </p>

          <div className="mt-5 space-y-2">
            {[5, 4, 3, 2, 1].map((n) => {
              const count = summary.distribution[n as 1 | 2 | 3 | 4 | 5];
              const pct = summary.count ? (count / summary.count) * 100 : 0;
              const active = ratingFilter === n;
              return (
                <button
                  key={n}
                  onClick={() => setRatingFilter(active ? null : n)}
                  className={`flex w-full items-center gap-2 rounded-lg px-2 py-1 text-xs transition ${
                    active ? "bg-mist" : "hover:bg-mist/50"
                  }`}
                >
                  <span className="w-8 shrink-0 text-ink-soft">{n} star</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-mist">
                    <div
                      className="h-full rounded-full bg-gold"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-6 shrink-0 text-right text-ink-soft">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
          {ratingFilter && (
            <button
              onClick={() => setRatingFilter(null)}
              className="mt-3 w-full rounded-full bg-white px-4 py-2 text-xs font-semibold text-ink ring-1 ring-black/10 transition hover:bg-cream-soft"
            >
              Clear filter
            </button>
          )}
        </div>
      </aside>

      {/* Reviews list */}
      <div>
        <p className="mb-4 text-sm text-ink-soft">
          Showing {filtered.length}{" "}
          {filtered.length === 1 ? "review" : "reviews"}
          {ratingFilter ? ` · ${ratingFilter} stars` : ""}
        </p>

        {filtered.length === 0 ? (
          <p className="rounded-2xl bg-white/70 px-6 py-10 text-center text-ink-soft ring-1 ring-black/5">
            No reviews at this rating yet.
          </p>
        ) : (
          <ul className="space-y-5">
            {filtered.map((r) => (
              <li
                key={r.id}
                className="rounded-2xl bg-white/70 p-5 ring-1 ring-black/5"
              >
                <div className="flex items-start gap-4">
                  {r.productImage && (
                    <Link
                      href={r.productSlug ? `/shop/${r.productSlug}` : "/shop"}
                      className="relative h-16 w-14 shrink-0 overflow-hidden rounded-xl ring-1 ring-black/5"
                    >
                      <Image
                        src={r.productImage}
                        alt={r.productName}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </Link>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Stars value={r.rating} />
                      {r.verifiedPurchase && (
                        <span className="rounded-full bg-sage/15 px-2.5 py-1 text-[11px] font-semibold text-sage-deep">
                          Verified buyer
                        </span>
                      )}
                    </div>
                    <h3 className="mt-2 font-display text-lg font-semibold text-ink">
                      {r.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-ink-soft">{r.body}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-soft">
                      <span className="font-medium text-ink">
                        {r.reviewerName}
                      </span>
                      <span>·</span>
                      <span>
                        {new Date(r.createdAt).toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                      {r.productSlug && (
                        <>
                          <span>·</span>
                          <Link
                            href={`/shop/${r.productSlug}`}
                            className="font-semibold text-moss underline-offset-2 hover:underline"
                          >
                            {r.productName}
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
