"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/db/schema";
import { useWishlist } from "@/lib/wishlist-context";
import { useAuth } from "@/lib/auth-context";
import { openAuthModal } from "./AuthModal";
import { useToast } from "./Toast";

type Props = {
  product: Product;
  variant?: "icon" | "pill";
  className?: string;
};

export function WishlistButton({ product, variant = "icon", className = "" }: Props) {
  const { has, toggle } = useWishlist();
  const { user } = useAuth();
  const { show } = useToast();
  const [active, setActive] = useState(false);
  const [pulsing, setPulsing] = useState(false);

  useEffect(() => {
    setActive(has(product.id));
  }, [has, product.id]);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      openAuthModal("login");
      show("Sign in to save favorites", "default");
      return;
    }
    try {
      await toggle({
        id: product.id,
        slug: product.slug,
        name: product.name,
        priceCents: product.priceCents,
        imageUrl: product.imageUrl,
        stock: product.stock,
        tagline: product.tagline,
      });
      setPulsing(true);
      setTimeout(() => setPulsing(false), 500);
    } catch (err) {
      show(err instanceof Error ? err.message : "Could not update wishlist", "error");
    }
  }

  if (variant === "pill") {
    return (
      <button
        onClick={handleClick}
        className={`inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-ink ring-1 ring-black/10 transition hover:bg-cream-soft ${
          active ? "ring-clay text-clay" : ""
        } ${className}`}
      >
        <span className={active ? "text-clay" : ""}>
          {active ? "♥" : "♡"}
        </span>
        {active ? "Saved" : "Save"}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      aria-label={active ? `Remove ${product.name} from wishlist` : `Save ${product.name}`}
      aria-pressed={active}
      className={`grid h-9 w-9 place-items-center rounded-full bg-white/90 text-ink ring-1 ring-black/5 backdrop-blur transition hover:scale-110 ${
        active ? "text-clay" : ""
      } ${pulsing ? "animate-[flame_0.5s_ease-out]" : ""} ${className}`}
    >
      <span
        className={`text-lg transition ${active ? "scale-110" : ""}`}
        style={{ fill: active ? "currentColor" : "none" }}
      >
        ♥
      </span>
    </button>
  );
}
