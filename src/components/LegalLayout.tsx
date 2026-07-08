import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Reveal } from "./Reveal";

export function LegalLayout({
  title,
  subtitle,
  lastUpdated,
  children,
}: {
  title: string;
  subtitle: string;
  lastUpdated: string;
  children: ReactNode;
}) {
  return (
    <main className="relative min-h-screen overflow-x-clip">
      <Navbar />
      <section className="pt-32 pb-12 sm:pt-40">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sage-deep">
              Legal
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              {title}
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-3 text-ink-soft">{subtitle}</p>
          </Reveal>
          <Reveal delay={180}>
            <p className="mt-2 text-xs uppercase tracking-wide text-ink-soft">
              Last updated · {lastUpdated}
            </p>
          </Reveal>
        </div>
      </section>
      <section className="pb-24 sm:pb-32">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <Reveal>
            <div className="prose-aura space-y-5 leading-relaxed text-ink-soft">
              {children}
            </div>
          </Reveal>
        </div>
      </section>
      <Footer />
    </main>
  );
}
