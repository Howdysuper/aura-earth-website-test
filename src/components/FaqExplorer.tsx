"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { faqCategories, faqs, type Faq } from "@/lib/faqs";

type Filter = "All" | (typeof faqCategories)[number];

export function FaqExplorer() {
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return faqs.filter((f) => {
      const matchesCat = filter === "All" || f.category === filter;
      const matchesTerm =
        !term ||
        f.q.toLowerCase().includes(term) ||
        f.a.toLowerCase().includes(term);
      return matchesCat && matchesTerm;
    });
  }, [filter, query]);

  function idFor(f: Faq) {
    return `${f.category}-${f.q}`;
  }

  const noResults = filtered.length === 0;

  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8">
      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-5 top-1/2 -translate-y-1/2 text-ink-soft"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search questions…"
          className="w-full rounded-2xl bg-white py-4 pr-5 pl-12 text-base text-ink shadow-[var(--shadow-soft)] ring-1 ring-black/10 outline-none focus:ring-2 focus:ring-sage"
        />
      </div>

      {/* Category pills */}
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {(["All", ...faqCategories] as Filter[]).map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
              filter === c
                ? "bg-moss text-cream-soft shadow-[var(--shadow-soft)]"
                : "bg-white/70 text-ink-soft ring-1 ring-black/5 hover:bg-white"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Results */}
      <p className="mt-6 text-center text-sm text-ink-soft">
        {noResults
          ? "No matching questions."
          : `${filtered.length} ${filtered.length === 1 ? "question" : "questions"}`}
      </p>

      {noResults ? (
        <div className="mt-4 rounded-2xl bg-white/70 px-6 py-10 text-center ring-1 ring-black/5">
          <p className="text-ink-soft">
            We couldn&apos;t find an answer for that. Our team is happy to help.
          </p>
          <Link
            href="/contact"
            className="mt-4 inline-flex rounded-full bg-moss px-6 py-3 text-sm font-semibold text-cream-soft transition hover:bg-sage-deep"
          >
            Contact us
          </Link>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {filtered.map((f) => {
            const id = idFor(f);
            const isOpen = openId === id;
            return (
              <div
                key={id}
                className={`overflow-hidden rounded-2xl ring-1 transition-all duration-300 ${
                  isOpen
                    ? "bg-white shadow-[var(--shadow-soft)] ring-black/10"
                    : "bg-white/60 ring-black/5"
                }`}
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : id)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
                  aria-expanded={isOpen}
                >
                  <span>
                    <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-sage-deep">
                      {f.category}
                    </span>
                    <span className="font-display text-lg font-semibold text-ink">
                      {f.q}
                    </span>
                  </span>
                  <span
                    className={`grid h-7 w-7 shrink-0 place-items-center rounded-full bg-mist text-moss transition-transform duration-300 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 sm:px-6">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
