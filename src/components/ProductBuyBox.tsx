"use client";

import { useState } from "react";
import type { Product } from "@/db/schema";
import { useCart } from "@/lib/cart-context";

export function ProductBuyBox({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const soldOut = product.stock <= 0;
  const max = product.stock > 0 ? product.stock : 1;

  function handleAdd() {
    if (soldOut) return;
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        priceCents: product.priceCents,
        imageUrl: product.imageUrl,
        stock: product.stock,
      },
      qty,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center rounded-full ring-1 ring-black/15">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
            className="grid h-12 w-12 place-items-center rounded-full text-lg text-ink transition hover:bg-black/5 disabled:opacity-30"
            disabled={soldOut || qty <= 1}
          >
            −
          </button>
          <span className="w-10 text-center text-base font-semibold">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(max, q + 1))}
            aria-label="Increase quantity"
            className="grid h-12 w-12 place-items-center rounded-full text-lg text-ink transition hover:bg-black/5 disabled:opacity-30"
            disabled={soldOut || qty >= max}
          >
            +
          </button>
        </div>

        <button
          onClick={handleAdd}
          disabled={soldOut}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-moss px-8 py-4 text-base font-semibold text-cream-soft shadow-[var(--shadow-soft)] transition-all duration-300 hover:bg-sage-deep hover:shadow-[var(--shadow-lift)] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-ink/30"
        >
          {soldOut
            ? "Notify me when back"
            : added
              ? "Added to cart ✓"
              : "Add to cart"}
        </button>
      </div>
      {!soldOut && product.stock <= 20 && (
        <p className="mt-3 text-sm font-medium text-clay">
          🔥 Selling fast—only {product.stock} left in stock.
        </p>
      )}
    </div>
  );
}
