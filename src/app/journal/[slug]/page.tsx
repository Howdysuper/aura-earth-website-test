import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { getPostBySlug, getPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Not found — Aura & Earth" };
  return { title: `${post.title} — Aura & Earth`, description: post.excerpt };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const all = await getPosts();
  const more = all.filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <main className="relative min-h-screen overflow-x-clip">
      <Navbar />
      <article className="pt-28 pb-16 sm:pt-36">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <Reveal>
            <Link
              href="/journal"
              className="text-sm text-ink-soft transition hover:text-ink"
            >
              ← Back to journal
            </Link>
          </Reveal>
          <Reveal delay={60}>
            <span className="mt-4 inline-block text-xs font-semibold uppercase tracking-wide text-sage-deep">
              {post.category} · {post.readMinutes} min read
            </span>
            <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              {post.title}
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-4 text-sm text-ink-soft">
              By {post.author} ·{" "}
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </Reveal>
          <Reveal delay={160}>
            <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-[var(--radius-xl2)] shadow-[var(--shadow-lift)] ring-1 ring-black/5">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 720px"
                priority
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={200}>
            <div className="prose-aura mt-10 space-y-5 text-lg leading-relaxed text-ink-soft">
              {post.body.split("\n\n").map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Reveal>
        </div>
      </article>
      {more.length > 0 && (
        <section className="border-t border-black/5 bg-cream-soft/40 py-20">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <h2 className="font-display text-2xl font-semibold text-ink">
              Keep reading
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {more.map((p, i) => (
                <Reveal key={p.id} delay={i * 80}>
                  <Link
                    href={`/journal/${p.slug}`}
                    className="group block rounded-2xl bg-white/70 p-4 ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wide text-sage-deep">
                      {p.category}
                    </span>
                    <h3 className="mt-1.5 font-display text-base font-semibold text-ink group-hover:text-moss">
                      {p.title}
                    </h3>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
      <Footer />
    </main>
  );
}
