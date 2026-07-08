import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Sustainability — Aura & Earth",
  description: "Our commitments to clean ingredients, ethical sourcing, and a lighter footprint.",
};

const pledges = [
  {
    icon: "🌿",
    title: "100% plant-based wax",
    body: "Soy and coconut, never paraffin. Tested for clean burn with every batch.",
  },
  {
    icon: "🧪",
    title: "Zero phthalates, zero parabens",
    body: "If we wouldn't put it in a diffuser in our own home, we won't put it in yours.",
  },
  {
    icon: "🌳",
    title: "A tree for every order",
    body: "We've partnered with reforestation nonprofits to plant 48,000+ trees to date.",
  },
  {
    icon: "♻️",
    title: "Refillable vessels",
    body: "Stoneware that lasts. Refill credits when you return your jar.",
  },
  {
    icon: "🚚",
    title: "Carbon-neutral shipping",
    body: "100% of delivery emissions are offset. Always.",
  },
  {
    icon: "📦",
    title: "Recycled packaging",
    body: "FSC-certified paper, soy-based inks, and zero plastic in the box.",
  },
];

export default function SustainabilityPage() {
  return (
    <main className="relative min-h-screen overflow-x-clip">
      <Navbar />
      <section className="pt-32 pb-12 sm:pt-40">
        <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-sage-deep">
              Our commitments
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight text-ink sm:text-6xl">
              Beauty that doesn&apos;t cost the earth
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-ink-soft">
              Sustainability isn&apos;t a tagline—it&apos;s a checklist we run
              every product through. Here&apos;s exactly what we&apos;re
              committed to.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-24 sm:pb-32">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pledges.map((p, i) => (
              <Reveal key={p.title} delay={i * 60}>
                <div className="rounded-2xl bg-white/70 p-6 ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-mist text-2xl">
                    {p.icon}
                  </span>
                  <h2 className="mt-4 font-display text-xl font-semibold text-ink">
                    {p.title}
                  </h2>
                  <p className="mt-2 text-sm text-ink-soft">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-16 rounded-[var(--radius-xl2)] bg-moss p-8 text-cream-soft sm:p-12">
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Our take-back program
            </h2>
            <p className="mt-4 max-w-2xl text-cream-soft/85">
              Send back any Aura &amp; Earth vessel and we&apos;ll refill it for
              half the price of a new candle. Or, we&apos;ll repair and donate
              it. Either way, it lives a second life.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex rounded-full bg-cream-soft px-6 py-3 text-sm font-semibold text-moss transition hover:bg-white"
            >
              Start a return →
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
