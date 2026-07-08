"use client";

import { useState } from "react";
import type { Product } from "@/db/schema";
import { useCart } from "@/lib/cart-context";

type Props = {
  product: Product;
  quantity?: number;
  className?: string;
  label?: string;
  fullWidth?: boolean;
};

export function AddToCartButton({
  product,
  quantity = 1,
  className = "",
  label = "Add to cart",
  fullWidth = false,
}: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const soldOut = product.stock <= 0;

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
      quantity,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      onClick={handleAdd}
      disabled={soldOut}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-moss px-5 py-3 text-sm font-semibold text-cream-soft transition-all duration-300 hover:bg-sage-deep active:scale-95 disabled:cursor-not-allowed disabled:bg-ink/30 ${
        fullWidth ? "w-full" : ""
      } ${className}`}
    >
      {soldOut ? "Notify me" : added ? "Added ✓" : label}
    </button>
  );
}
