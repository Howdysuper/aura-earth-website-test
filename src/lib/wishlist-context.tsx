"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "./auth-context";

export type WishlistItem = {
  id: string;
  slug: string;
  name: string;
  priceCents: number;
  imageUrl: string;
  stock: number;
  tagline: string;
};

type WishlistContextValue = {
  items: WishlistItem[];
  loading: boolean;
  has: (productId: string) => boolean;
  toggle: (product: {
    id: string;
    slug: string;
    name: string;
    priceCents: number;
    imageUrl: string;
    stock: number;
    tagline: string;
  }) => Promise<void>;
  refresh: () => Promise<void>;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/wishlist", { cache: "no-store" });
      const data = await res.json();
      if (res.ok && data.ok) setItems(data.items ?? []);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const has = useCallback(
    (productId: string) => items.some((i) => i.id === productId),
    [items],
  );

  const toggle = useCallback<WishlistContextValue["toggle"]>(
    async (product) => {
      if (!user) {
        throw new Error("Please sign in to save favorites.");
      }
      const isSaved = items.some((i) => i.id === product.id);
      // Optimistic update
      setItems((prev) =>
        isSaved
          ? prev.filter((i) => i.id !== product.id)
          : [
              ...prev,
              {
                id: product.id,
                slug: product.slug,
                name: product.name,
                priceCents: product.priceCents,
                imageUrl: product.imageUrl,
                stock: product.stock,
                tagline: product.tagline,
              },
            ],
      );
      try {
        const res = await fetch("/api/wishlist", {
          method: isSaved ? "DELETE" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product.id }),
        });
        if (!res.ok) await refresh();
      } catch {
        await refresh();
      }
    },
    [user, items, refresh],
  );

  const value = useMemo<WishlistContextValue>(
    () => ({ items, loading, has, toggle, refresh }),
    [items, loading, has, toggle, refresh],
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx)
    throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
