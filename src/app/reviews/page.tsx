import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { ReviewsExplorer } from "@/components/ReviewsExplorer";
import type { ReviewItem } from "@/components/ReviewsExplorer";
import { getAllReviews } from "@/lib/reviews";
import { fallbackReviews, fallbackReviewSummary } from "@/lib/seed-reviews";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reviews — Aura & Earth",
  description:
    "See what 12,000+ conscious homes say about Aura & Earth candles—real reviews from verified buyers.",
};

export default async function ReviewsPage() {
  const { reviews: dbReviews, summary } = await getAllReviews();

  const useFallback = dbReviews.length === 0;
  const reviews: ReviewItem[] = useFallback
    ? fallbackReviews.map((r) => ({ ...r }))
    : dbReviews.map((r) => ({
        id: r.id,
        rating: r.rating,
        title: r.title,
        body: r.body,
        verifiedPurchase: r.verifiedPurchase,
        createdAt: r.createdAt.toISOString(),
        reviewerName: r.reviewerName,
        productName: r.productName,
        productSlug: r.productSlug,
        productImage: r.productImage,
      }));

  const finalSummary = useFallback ? fallbackReviewSummary : summary;

  return (
    <main className="relative min-h-screen overflow-x-clip">
      <Navbar />

      <section className="relative overflow-hidden pt-32 pb-12 sm:pt-40">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/3 top-0 h-80 w-80 rounded-full bg-sage/20 blur-3xl animate-float-slow" />
          <div className="absolute right-1/4 top-16 h-72 w-72 rounded-full bg-clay-soft/25 blur-3xl animate-float" />
        </div>
        <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-sage-deep">
              Loved out loud
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight text-ink sm:text-6xl">
              What our community is saying
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="mx-auto mt-5 max-w-xl text-lg text-ink-soft">
              Real reviews from real, verified buyers. Filter by rating to find
              the scents people can&apos;t stop burning.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-24 sm:pb-32">
        <ReviewsExplorer reviews={reviews} summary={finalSummary} />
      </section>

      <section className="pb-24 sm:pb-32">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <Reveal>
            <div className="rounded-[var(--radius-xl2)] bg-gradient-to-br from-moss via-sage-deep to-moss p-8 text-center text-cream-soft sm:p-12">
              <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                Find your next favorite scent
              </h2>
              <p className="mx-auto mt-3 max-w-md text-cream-soft/85">
                Every candle is hand-poured, clean-burning, and backed by our
                30-day happiness guarantee.
              </p>
              <Link
                href="/shop"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-cream-soft px-7 py-3.5 text-sm font-semibold text-moss transition hover:bg-white"
              >
                Shop the collection
                <span className="ml-1">→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}
