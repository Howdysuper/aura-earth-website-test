import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { WishlistGrid } from "@/components/WishlistGrid";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Wishlist — Aura & Earth",
  description: "Your saved scents, ready when you are.",
};

export default function WishlistPage() {
  return (
    <main className="relative min-h-screen overflow-x-clip">
      <Navbar />
      <section className="pt-32 pb-24 sm:pt-40">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-sage-deep">
              Saved by you
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              Your wishlist
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-3 text-ink-soft">
              Sign in to sync your favorites across devices. Your wishlist is
              saved on your account whenever you&apos;re signed in.
            </p>
          </Reveal>
          <div className="mt-10">
            <WishlistGrid />
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/shop"
              className="text-sm font-semibold text-moss underline-offset-2 hover:underline"
            >
              Keep browsing →
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
