import "server-only";
import {
  getProducts as fbGetProducts,
  getProductBySlug as fbGetProductBySlug,
  getOrderByReference as fbGetOrderByReference,
  seedProductsIfEmpty,
  isAdminConfigured,
  type Product,
} from "./firestore";
import { seedProducts, type SeedProduct } from "./seed-data";

let seedAttempted = false;

function fallbackProducts(): Product[] {
  return seedProducts.map((p, i) => ({
    ...p,
    id: String(i + 1),
    createdAt: new Date(),
  }));
}

export async function getProducts(): Promise<Product[]> {
  if (!isAdminConfigured()) return fallbackProducts();
  try {
    const existing = await fbGetProducts();
    if (existing.length > 0) return existing;

    if (!seedAttempted) {
      seedAttempted = true;
      return seedProductsIfEmpty();
    }
    return [];
  } catch {
    return fallbackProducts();
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isAdminConfigured()) {
    return fallbackProducts().find((p) => p.slug === slug) ?? null;
  }
  try {
    const row = await fbGetProductBySlug(slug);
    if (row) return row;
    await getProducts();
    return fbGetProductBySlug(slug);
  } catch {
    return fallbackProducts().find((p) => p.slug === slug) ?? null;
  }
}

export async function getOrderByReference(reference: string) {
  if (!isAdminConfigured()) return null;
  return fbGetOrderByReference(reference);
}

export { formatPrice, formatPriceShort } from "./format";
