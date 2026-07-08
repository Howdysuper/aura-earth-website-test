import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Our story — Aura & Earth",
  description:
    "How a Sunday morning, a single candle, and an obsession with clean air became Aura & Earth.",
};

export default function AboutPage() {
  return (
    <main className="relative min-h-screen overflow-x-clip">
      <Navbar />
      <section className="pt-32 pb-12 sm:pt-40">
        <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-sage-deep">
              Our story
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight text-ink sm:text-6xl">
              A candle, a Sunday, and a small idea
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="pb-20 sm:pb-28">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <Reveal>
            <div className="relative aspect-[16/9] overflow-hidden rounded-[var(--radius-xl2)] shadow-[var(--shadow-lift)] ring-1 ring-black/5">
              <Image
                src="https://images.pexels.com/photos/7234509/pexels-photo-7234509.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400"
                alt="Hand-pouring a candle in the studio"
                fill
                sizes="(max-width: 768px) 100vw, 720px"
                className="object-cover"
              />
            </div>
          </Reveal>
          <div className="mt-12 space-y-5 text-lg leading-relaxed text-ink-soft">
            <Reveal>
              <p>
                Aura &amp; Earth started in 2021 with a single candle, a
                second-hand pot, and a Sunday morning that felt slower than it
                had in years. Our founder, Maya, kept glancing at the
                ingredient list on the candle she was burning and thinking:
                there has to be a better way.
              </p>
            </Reveal>
            <Reveal>
              <p>
                We make candles and home goods the way they used to be made in
                kitchens, not factories. Hand-poured in small batches. Tested
                for a full week before the first jar ships. Designed to be
                displayed, not hidden in a cabinet.
              </p>
            </Reveal>
            <Reveal>
              <p>
                We&apos;re a small team. We answer our own emails. We plant a
                tree for every order. We don&apos;t believe a beautiful object
                should cost the earth.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-t border-black/5 bg-cream-soft/40 py-20">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <h2 className="text-center font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            What we believe
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Clean air is a design choice",
                body: "What you breathe should be as intentional as what you display. Every ingredient earns its place.",
              },
              {
                title: "Small batches, big intention",
                body: "Quality you can smell. Every candle is checked by hand before it ships.",
              },
              {
                title: "Refill, don't replace",
                body: "Our vessels are designed to last for years and live a second life as planters, cups, and catch-alls.",
              },
            ].map((v, i) => (
              <Reveal key={v.title} delay={i * 80}>
                <div className="rounded-2xl bg-white/70 p-6 ring-1 ring-black/5">
                  <h3 className="font-display text-xl font-semibold text-ink">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-ink-soft">{v.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/shop"
              className="inline-flex rounded-full bg-moss px-7 py-3.5 text-sm font-semibold text-cream-soft transition hover:bg-sage-deep"
            >
              Shop the collection
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
