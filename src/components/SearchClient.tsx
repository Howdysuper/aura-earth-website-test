"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/db/schema";
import { formatPriceShort } from "@/lib/format";
import { StockBadge } from "@/components/ProductShowcase";

export function SearchClient({ products }: { products: Product[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const initialQ = params.get("q") ?? "";
  const [q, setQ] = useState(initialQ);

  useEffect(() => {
    setQ(initialQ);
  }, [initialQ]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return products;
    return products.filter((p) => {
      const haystack = [
        p.name,
        p.tagline,
        p.description,
        p.scentNotes,
        ...(p.badge ? [p.badge] : []),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(term);
    });
  }, [q, products]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const url = q.trim() ? `/search?q=${encodeURIComponent(q.trim())}` : "/search";
    router.push(url);
  }

  return (
    <div className="mx-auto max-w-5xl px-5 sm:px-8">
      <form onSubmit={onSubmit} className="relative">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoFocus
          placeholder="Search candles, scents, ingredients…"
          className="w-full rounded-2xl bg-white px-6 py-5 text-lg text-ink shadow-[var(--shadow-soft)] ring-1 ring-black/10 outline-none focus:ring-2 focus:ring-sage"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-moss px-5 py-2.5 text-sm font-semibold text-cream-soft transition hover:bg-sage-deep"
        >
          Search
        </button>
      </form>

      <p className="mt-4 text-sm text-ink-soft">
        {q.trim()
          ? `${results.length} ${results.length === 1 ? "result" : "results"} for "${q.trim()}"`
          : `Showing all ${products.length} candles`}
      </p>

      {results.length === 0 ? (
        <div className="mt-10 rounded-2xl bg-white/70 px-6 py-12 text-center ring-1 ring-black/5">
          <p className="text-ink-soft">No candles matched your search.</p>
          <Link
            href="/shop"
            className="mt-4 inline-block text-sm font-semibold text-moss underline-offset-2 hover:underline"
          >
            Browse all →
          </Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {results.map((p) => (
            <li key={p.id}>
              <Link
                href={`/shop/${p.slug}`}
                className="group flex items-center gap-5 rounded-2xl bg-white/70 p-4 ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)] sm:p-5"
              >
                <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl ring-1 ring-black/5">
                  <Image
                    src={p.imageUrl}
                    alt={p.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-lg font-semibold text-ink group-hover:text-moss">
                      {p.name}
                    </h3>
                    <StockBadge stock={p.stock} />
                  </div>
                  <p className="text-sm text-ink-soft">{p.tagline}</p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-sage-deep">
                    {p.scentNotes}
                  </p>
                </div>
                <span className="font-display text-lg font-semibold text-ink">
                  {formatPriceShort(p.priceCents)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
