import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductShowcase";
import { Reveal } from "@/components/Reveal";
import { getProducts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop All Candles — Aura & Earth",
  description:
    "Browse the full collection of hand-poured, non-toxic soy candles from Aura & Earth.",
};

export default async function ShopPage() {
  const products = await getProducts();
  const inStock = products.filter((p) => p.stock > 0).length;

  return (
    <main className="relative min-h-screen overflow-x-clip">
      <Navbar />

      <section className="relative overflow-hidden pt-32 pb-12 sm:pt-40 sm:pb-16">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 left-1/4 h-80 w-80 rounded-full bg-sage/20 blur-3xl animate-float-slow" />
          <div className="absolute top-10 right-10 h-72 w-72 rounded-full bg-clay-soft/25 blur-3xl animate-float" />
        </div>
        <div className="mx-auto max-w-7xl px-5 text-center sm:px-8">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-sage-deep">
              The full collection
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mx-auto mt-4 max-w-3xl font-display text-5xl font-semibold tracking-tight text-ink sm:text-6xl">
              Find your <span className="text-gradient">signature scent</span>
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="mx-auto mt-5 max-w-xl text-lg text-ink-soft">
              Every candle is hand-poured with 100% soy &amp; coconut wax, cotton
              wicks, and clean fragrance. {inStock} scents in stock now—free
              carbon-neutral shipping over $50.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-24 sm:pb-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} delay={(i % 3) * 80} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
