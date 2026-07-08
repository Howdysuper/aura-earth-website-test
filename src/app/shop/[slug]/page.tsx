import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard, StockBadge } from "@/components/ProductShowcase";
import { ProductBuyBox } from "@/components/ProductBuyBox";
import { ReviewSection } from "@/components/ReviewSection";
import { WishlistButton } from "@/components/WishlistButton";
import { Reveal } from "@/components/Reveal";
import {
  getProductBySlug,
  getProducts,
  formatPrice,
} from "@/lib/queries";
import { getCurrentUser } from "@/lib/auth";
import {
  getReviewSummary,
  getReviewsForProduct,
  userHasPurchased,
} from "@/lib/reviews";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Not found — Aura & Earth" };
  return {
    title: `${product.name} — Aura & Earth`,
    description: product.tagline,
  };
}

const highlights = [
  { icon: "🌿", label: "100% soy & coconut wax" },
  { icon: "🕯️", label: "Lead-free cotton wick" },
  { icon: "♻️", label: "Refillable stoneware vessel" },
  { icon: "🌍", label: "Carbon-neutral shipping" },
];

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const all = await getProducts();
  const related = all.filter((p) => p.id !== product.id).slice(0, 3);

  const [reviews, summary, user] = await Promise.all([
    getReviewsForProduct(product.id),
    getReviewSummary(product.id),
    getCurrentUser(),
  ]);
  const verifiedBuyer = user
    ? await userHasPurchased(user.id, product.id)
    : false;

  const initialReviews = reviews.map((r) => ({
    id: r.id,
    rating: r.rating,
    title: r.title,
    body: r.body,
    verifiedPurchase: r.verifiedPurchase,
    createdAt: r.createdAt.toISOString(),
    reviewerName: r.reviewerName,
  }));

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name: "Shop", item: "/shop" },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `/shop/${product.slug}`,
      },
    ],
  };

  return (
    <main className="relative min-h-screen overflow-x-clip">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Navbar />

      <section className="pt-28 pb-12 sm:pt-36">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <nav
            className="mb-8 flex items-center gap-2 text-sm text-ink-soft"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="transition hover:text-ink">
              Home
            </Link>
            <span>/</span>
            <Link href="/shop" className="transition hover:text-ink">
              Shop
            </Link>
            <span>/</span>
            <span className="text-ink">{product.name}</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <div className="relative">
                <div className="absolute -inset-4 -z-10 rounded-[var(--radius-xl2)] bg-gradient-to-br from-sage/20 to-clay-soft/30 blur-2xl" />
                <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-xl2)] shadow-[var(--shadow-lift)] ring-1 ring-black/5">
                  <Image
                    src={product.imageUrl}
                    alt={`${product.name} — ${product.scentNotes}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                    className="object-cover"
                  />
                  {product.badge && (
                    <span className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-moss backdrop-blur">
                      {product.badge}
                    </span>
                  )}
                  <div className="absolute right-4 top-4">
                    <WishlistButton product={product} />
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="lg:pt-4">
                <div className="flex items-center gap-3">
                  <StockBadge stock={product.stock} />
                  {summary.count > 0 && (
                    <span className="flex items-center gap-1 text-sm text-gold">
                      ★★★★★{" "}
                      <span className="font-semibold text-ink">
                        {summary.average.toFixed(1)}
                      </span>
                      <span className="text-ink-soft">({summary.count})</span>
                    </span>
                  )}
                </div>

                <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                  {product.name}
                </h1>
                <p className="mt-3 text-lg text-ink-soft">{product.tagline}</p>

                <p className="mt-5 font-display text-3xl font-semibold text-ink">
                  {formatPrice(product.priceCents)}
                </p>

                <div className="mt-6 rounded-2xl bg-white/60 p-4 ring-1 ring-black/5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-sage-deep">
                    Scent profile
                  </p>
                  <p className="mt-1 font-display text-lg text-ink">
                    {product.scentNotes}
                  </p>
                </div>

                <p className="mt-6 leading-relaxed text-ink-soft">
                  {product.description}
                </p>

                <ProductBuyBox product={product} />

                <dl className="mt-8 grid grid-cols-2 gap-3 border-t border-black/5 pt-6">
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-ink-soft">
                      Burn time
                    </dt>
                    <dd className="font-display text-xl font-semibold text-ink">
                      {product.burnHours}+ hrs
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-ink-soft">
                      Net weight
                    </dt>
                    <dd className="font-display text-xl font-semibold text-ink">
                      8 oz
                    </dd>
                  </div>
                </dl>

                <ul className="mt-6 grid grid-cols-2 gap-3">
                  {highlights.map((h) => (
                    <li
                      key={h.label}
                      className="flex items-center gap-2.5 rounded-xl bg-white/50 px-3 py-2.5 text-sm text-ink-soft ring-1 ring-black/5"
                    >
                      <span className="text-lg">{h.icon}</span>
                      {h.label}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-t border-black/5 bg-cream-soft/40 pb-24 sm:pb-32">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <ReviewSection
            productId={product.id}
            initialReviews={initialReviews}
            initialSummary={summary}
            canReview={!!user}
            verifiedBuyer={verifiedBuyer}
          />
        </div>
      </section>

      {related.length > 0 && (
        <section className="pb-24 sm:pb-32">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal>
              <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                You might also love
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} delay={i * 80} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
