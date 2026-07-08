"use client";

import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "@/lib/wishlist-context";
import { useAuth } from "@/lib/auth-context";
import { openAuthModal } from "./AuthModal";
import { AddToCartButton } from "./AddToCartButton";
import { formatPrice } from "@/lib/format";

export function WishlistGrid() {
  const { user } = useAuth();
  const { items, loading, refresh } = useWishlist();

  if (!user) {
    return (
      <div className="rounded-2xl bg-white/70 px-6 py-12 text-center ring-1 ring-black/5">
        <span className="text-5xl">♥</span>
        <p className="mt-4 font-display text-xl font-semibold text-ink">
          Sign in to save favorites
        </p>
        <p className="mt-2 text-ink-soft">
          Your wishlist syncs to your account and works on any device.
        </p>
        <button
          onClick={() => openAuthModal("login")}
          className="mt-5 rounded-full bg-moss px-6 py-3 text-sm font-semibold text-cream-soft transition hover:bg-sage-deep"
        >
          Sign in
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <p className="rounded-2xl bg-white/70 px-6 py-10 text-center text-ink-soft ring-1 ring-black/5">
        Loading your wishlist…
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl bg-white/70 px-6 py-12 text-center ring-1 ring-black/5">
        <span className="text-5xl">♡</span>
        <p className="mt-4 font-display text-xl font-semibold text-ink">
          No saved scents yet
        </p>
        <p className="mt-2 text-ink-soft">
          Tap the heart on any candle to save it for later.
        </p>
        <Link
          href="/shop"
          className="mt-5 inline-flex rounded-full bg-moss px-6 py-3 text-sm font-semibold text-cream-soft transition hover:bg-sage-deep"
        >
          Explore candles
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <article
          key={item.id}
          className="group flex flex-col overflow-hidden rounded-2xl bg-white/70 ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
        >
          <Link
            href={`/shop/${item.slug}`}
            className="relative block aspect-[4/5] overflow-hidden"
          >
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </Link>
          <div className="flex flex-1 flex-col p-5">
            <Link href={`/shop/${item.slug}`}>
              <h3 className="font-display text-lg font-semibold text-ink transition-colors hover:text-moss">
                {item.name}
              </h3>
            </Link>
            <p className="mt-1 line-clamp-1 text-sm text-ink-soft">
              {item.tagline}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="font-display text-xl font-semibold text-ink">
                {formatPrice(item.priceCents)}
              </span>
              <AddToCartButton
                product={{
                  ...item,
                  badge: null,
                  description: item.tagline,
                  scentNotes: "",
                  burnHours: 0,
                  sortOrder: 0,
                  createdAt: new Date(),
                }}
              />
            </div>
            <button
              onClick={() => {
                void refresh();
              }}
              className="mt-3 text-left text-xs text-ink-soft underline-offset-2 hover:underline"
            >
              Remove
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
