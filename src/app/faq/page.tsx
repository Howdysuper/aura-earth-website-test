import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { FaqExplorer } from "@/components/FaqExplorer";

export const metadata: Metadata = {
  title: "FAQ — Aura & Earth",
  description:
    "Answers about our candles, the monthly box, shipping, returns, and our sustainability commitments.",
};

export default function FaqPage() {
  return (
    <main className="relative min-h-screen overflow-x-clip">
      <Navbar />
      <section className="relative overflow-hidden pt-32 pb-12 sm:pt-40">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-0 h-80 w-80 rounded-full bg-sage/20 blur-3xl animate-float-slow" />
          <div className="absolute right-10 top-10 h-72 w-72 rounded-full bg-clay-soft/25 blur-3xl animate-float" />
        </div>
        <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-sage-deep">
              Help center
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight text-ink sm:text-6xl">
              How can we help?
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="mx-auto mt-5 max-w-xl text-lg text-ink-soft">
              Everything you need to know about our candles, the candle box,
              shipping, and what makes us different. Still stuck?{" "}
              <Link
                href="/contact"
                className="font-semibold text-moss underline-offset-2 hover:underline"
              >
                Talk to us
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-24 sm:pb-32">
        <FaqExplorer />
      </section>

      <section className="pb-24 sm:pb-32">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <Reveal>
            <div className="rounded-[var(--radius-xl2)] bg-moss p-8 text-center text-cream-soft sm:p-12">
              <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                Still have questions?
              </h2>
              <p className="mx-auto mt-3 max-w-md text-cream-soft/85">
                Our small team answers every email personally—usually within a
                business day.
              </p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full bg-cream-soft px-6 py-3 text-sm font-semibold text-moss transition hover:bg-white"
                >
                  Contact support
                </Link>
                <a
                  href="mailto:hello@auraandearth.co"
                  className="inline-flex items-center justify-center rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-cream-soft ring-1 ring-white/15 transition hover:bg-white/20"
                >
                  hello@auraandearth.co
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}
