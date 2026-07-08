import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { getPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Journal — Aura & Earth",
  description:
    "Scent stories, candle care, and rituals for modern, conscious living.",
};

export default async function JournalPage() {
  const posts = await getPosts();
  const [featured, ...rest] = posts;

  return (
    <main className="relative min-h-screen overflow-x-clip">
      <Navbar />
      <section className="pt-32 pb-12 sm:pt-40 sm:pb-16">
        <div className="mx-auto max-w-7xl px-5 text-center sm:px-8">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-sage-deep">
              The journal
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mx-auto mt-4 max-w-3xl font-display text-5xl font-semibold tracking-tight text-ink sm:text-6xl">
              Scent stories &amp; slow living
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="mx-auto mt-5 max-w-xl text-lg text-ink-soft">
              Notes on ingredients, rituals, and the small things that turn a
              house into a home.
            </p>
          </Reveal>
        </div>
      </section>

      {featured && (
        <section className="pb-12 sm:pb-16">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal>
              <Link
                href={`/journal/${featured.slug}`}
                className="group block overflow-hidden rounded-[var(--radius-xl2)] bg-white/70 ring-1 ring-black/5 transition hover:shadow-[var(--shadow-lift)]"
              >
                <div className="grid gap-0 lg:grid-cols-2">
                  <div className="relative aspect-[4/3] overflow-hidden lg:aspect-auto">
                    <Image
                      src={featured.coverImage}
                      alt={featured.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col justify-center p-8 sm:p-10">
                    <span className="text-xs font-semibold uppercase tracking-wide text-sage-deep">
                      Featured · {featured.category}
                    </span>
                    <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                      {featured.title}
                    </h2>
                    <p className="mt-3 text-ink-soft">{featured.excerpt}</p>
                    <span className="mt-5 text-sm font-semibold text-moss underline-offset-2 group-hover:underline">
                      Read story →
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      <section className="pb-24 sm:pb-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((p, i) => (
              <Reveal key={p.id} delay={i * 80}>
                <Link
                  href={`/journal/${p.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white/70 ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={p.coverImage}
                      alt={p.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <span className="text-xs font-semibold uppercase tracking-wide text-sage-deep">
                      {p.category} · {p.readMinutes} min read
                    </span>
                    <h3 className="mt-2 font-display text-xl font-semibold text-ink transition-colors group-hover:text-moss">
                      {p.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm text-ink-soft">
                      {p.excerpt}
                    </p>
                    <span className="mt-auto pt-4 text-sm font-semibold text-moss">
                      Read →
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
