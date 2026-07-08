import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/db/schema";
import { formatPriceShort } from "@/lib/format";
import { Reveal } from "./Reveal";
import { AddToCartButton } from "./AddToCartButton";
import { WishlistButton } from "./WishlistButton";

export function StockBadge({ stock }: { stock: number }) {
  if (stock <= 0) {
    return (
      <span className="rounded-full bg-ink/80 px-2.5 py-1 text-[11px] font-semibold text-white">
        Sold out
      </span>
    );
  }
  if (stock <= 20) {
    return (
      <span className="rounded-full bg-clay px-2.5 py-1 text-[11px] font-semibold text-white">
        Only {stock} left
      </span>
    );
  }
  return (
    <span className="rounded-full bg-sage px-2.5 py-1 text-[11px] font-semibold text-white">
      In stock
    </span>
  );
}

export function ProductCard({
  product,
  delay = 0,
}: {
  product: Product;
  delay?: number;
}) {
  return (
    <Reveal delay={delay}>
      <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white/70 ring-1 ring-black/5 backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:shadow-[var(--shadow-lift)]">
        <Link
          href={`/shop/${product.slug}`}
          className="relative block aspect-[4/5] overflow-hidden"
          aria-label={`View ${product.name}`}
        >
          <Image
            src={product.imageUrl}
            alt={`${product.name} — ${product.scentNotes}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-moss/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          {product.badge && (
            <span className="absolute left-3 top-3 rounded-full bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-moss backdrop-blur">
              {product.badge}
            </span>
          )}
          <div className="absolute right-3 top-3 flex flex-col items-end gap-2">
            <WishlistButton product={product} />
            <StockBadge stock={product.stock} />
          </div>
        </Link>

        <div className="flex flex-1 flex-col p-5">
          <Link href={`/shop/${product.slug}`}>
            <h3 className="font-display text-xl font-semibold text-ink transition-colors hover:text-moss">
              {product.name}
            </h3>
          </Link>
          <p className="mt-1 text-sm text-ink-soft">{product.tagline}</p>
          <p className="mt-3 text-xs font-medium uppercase tracking-wide text-sage-deep">
            {product.scentNotes}
          </p>

          <div className="mt-5 flex items-center justify-between pt-4">
            <span className="font-display text-2xl font-semibold text-ink">
              {formatPriceShort(product.priceCents)}
            </span>
            <AddToCartButton product={product} />
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export function ProductShowcase({ products }: { products: Product[] }) {
  const featured = products.slice(0, 4);
  return (
    <section id="collection" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <Reveal>
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-sage-deep">
                The collection
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                Scents for every corner of calm
              </h2>
            </Reveal>
          </div>
          <Reveal delay={120}>
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 rounded-full bg-white/70 px-6 py-3 text-sm font-semibold text-ink ring-1 ring-black/10 backdrop-blur transition hover:bg-white"
            >
              View all candles
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p, i) => (
            <ProductCard key={p.id} product={p} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}
