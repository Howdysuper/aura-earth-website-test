import "server-only";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb, isAdminConfigured } from "./firebase-admin";

export { isAdminConfigured };

// ─── Types ───────────────────────────────────────────────────────────────────

export type Product = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  scentNotes: string;
  priceCents: number;
  imageUrl: string;
  badge: string | null;
  stock: number;
  burnHours: number;
  sortOrder: number;
  createdAt: Date;
};

export type Subscriber = {
  id: string;
  email: string;
  plan: string;
  source: string;
  createdAt: Date;
};

export type Order = {
  id: string;
  reference: string;
  userId: string | null;
  email: string;
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  status: string;
  createdAt: Date;
};

export type OrderItem = {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  unitPriceCents: number;
  quantity: number;
};

export type User = {
  id: string;
  email: string;
  fullName: string;
  createdAt: Date;
};

export type Address = {
  id: string;
  userId: string;
  label: string;
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: Date;
};

export type Review = {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  title: string;
  body: string;
  verifiedPurchase: boolean;
  createdAt: Date;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  coverImage: string;
  category: string;
  author: string;
  readMinutes: number;
  publishedAt: Date;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  topic: string;
  message: string;
  createdAt: Date;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toTimestamp(val: unknown): Date {
  if (val && typeof val === "object" && "toDate" in val) {
    return (val as { toDate: () => Date }).toDate();
  }
  if (val instanceof Date) return val;
  return new Date();
}

function mapDoc<T extends { id: string }>(
  snap: FirebaseFirestore.DocumentSnapshot,
): T {
  const data = snap.data()!;
  const result: Record<string, unknown> = { id: snap.id };
  for (const [key, val] of Object.entries(data)) {
    if (key.endsWith("At") || key === "createdAt") {
      result[key] = toTimestamp(val);
    } else {
      result[key] = val;
    }
  }
  return result as T;
}

function ts() {
  return FieldValue.serverTimestamp();
}

function db() {
  return getAdminDb();
}

// ─── Products ────────────────────────────────────────────────────────────────

const productsCol = () => db().collection("products");

export async function getProducts(): Promise<Product[]> {
  try {
    const snap = await productsCol().orderBy("sortOrder", "asc").get();
    return snap.docs.map((d) => mapDoc<Product>(d));
  } catch {
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const snap = await productsCol().where("slug", "==", slug).limit(1).get();
    return snap.docs.length > 0 ? mapDoc<Product>(snap.docs[0]) : null;
  } catch {
    return null;
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const snap = await productsCol().doc(id).get();
    return snap.exists ? mapDoc<Product>(snap) : null;
  } catch {
    return null;
  }
}

export async function updateProduct(
  id: string,
  data: Partial<Pick<Product, "stock" | "priceCents">>,
): Promise<Product | null> {
  try {
    await productsCol().doc(id).update(data);
    return getProductById(id);
  } catch {
    return null;
  }
}

// ─── Subscribers ─────────────────────────────────────────────────────────────

const subscribersCol = () => db().collection("subscribers");

export async function upsertSubscriber(
  email: string,
  plan: string,
  source: string,
): Promise<void> {
  try {
    const snap = await subscribersCol().where("email", "==", email).limit(1).get();
    if (snap.docs.length > 0) {
      await snap.docs[0].ref.update({ plan, source });
    } else {
      await subscribersCol().add({ email, plan, source, createdAt: ts() });
    }
  } catch {
    // ignore
  }
}

export async function getSubscribers(): Promise<Subscriber[]> {
  try {
    const snap = await subscribersCol().orderBy("createdAt", "desc").limit(20).get();
    return snap.docs.map((d) => mapDoc<Subscriber>(d));
  } catch {
    return [];
  }
}

export async function getSubscriberCount(): Promise<number> {
  try {
    const snap = await subscribersCol().get();
    return snap.size;
  } catch {
    return 0;
  }
}

// ─── Orders ──────────────────────────────────────────────────────────────────

const ordersCol = () => db().collection("orders");
const orderItemsCol = () => db().collection("orderItems");

export async function getOrderByReference(
  reference: string,
): Promise<{ order: Order; items: OrderItem[] } | null> {
  try {
    const snap = await ordersCol().where("reference", "==", reference).limit(1).get();
    if (snap.docs.length === 0) return null;
    const order = mapDoc<Order>(snap.docs[0]);
    const itemSnap = await orderItemsCol().where("orderId", "==", order.id).get();
    return {
      order,
      items: itemSnap.docs.map((d) => mapDoc<OrderItem>(d)),
    };
  } catch {
    return null;
  }
}

export async function getUserOrders(userId: string): Promise<
  (Order & {
    items: { id: string; productName: string; quantity: number; unitPriceCents: number }[];
  })[]
> {
  try {
    const snap = await ordersCol().where("userId", "==", userId).orderBy("createdAt", "desc").get();
    const orders = snap.docs.map((d) => mapDoc<Order>(d));
    const allItemsSnap = await orderItemsCol().get();
    const allItems = allItemsSnap.docs.map((d) => mapDoc<OrderItem>(d));
    const byOrder = new Map<string, OrderItem[]>();
    for (const item of allItems) {
      const arr = byOrder.get(item.orderId) ?? [];
      arr.push(item);
      byOrder.set(item.orderId, arr);
    }
    return orders.map((o) => ({
      ...o,
      items: (byOrder.get(o.id) ?? []).map((i) => ({
        id: i.id,
        productName: i.productName,
        quantity: i.quantity,
        unitPriceCents: i.unitPriceCents,
      })),
    }));
  } catch {
    return [];
  }
}

export async function getRecentOrders(): Promise<(Order & { itemCount: number })[]> {
  try {
    const snap = await ordersCol().orderBy("createdAt", "desc").limit(20).get();
    const orders = snap.docs.map((d) => mapDoc<Order>(d));
    const itemsSnap = await orderItemsCol().get();
    const allItems = itemsSnap.docs.map((d) => mapDoc<OrderItem>(d));
    const countMap = new Map<string, number>();
    for (const item of allItems) {
      countMap.set(item.orderId, (countMap.get(item.orderId) ?? 0) + item.quantity);
    }
    return orders.map((o) => ({
      ...o,
      itemCount: countMap.get(o.id) ?? 0,
    }));
  } catch {
    return [];
  }
}

export async function getOrderStats(): Promise<{
  revenueCents: number;
  orderCount: number;
}> {
  try {
    const snap = await ordersCol().get();
    const orders = snap.docs.map((d) => mapDoc<Order>(d));
    return {
      revenueCents: orders.reduce((sum, o) => sum + o.totalCents, 0),
      orderCount: orders.length,
    };
  } catch {
    return { revenueCents: 0, orderCount: 0 };
  }
}

export async function createOrder(data: {
  reference: string;
  userId: string | null;
  email: string;
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  items: {
    productId: string;
    productName: string;
    unitPriceCents: number;
    quantity: number;
  }[];
  stockUpdates: { productId: string; newStock: number }[];
}): Promise<{ reference: string; total: number; subtotal: number; shipping: number }> {
  await db().runTransaction(async (tx) => {
    for (const update of data.stockUpdates) {
      const prodRef = productsCol().doc(update.productId);
      const prodSnap = await tx.get(prodRef);
      if (!prodSnap.exists) throw new Error("A product in your cart is no longer available.");
      const stock = prodSnap.data()!.stock;
      const qty = data.items.find((i) => i.productId === update.productId)?.quantity ?? 0;
      if (stock < qty) {
        throw new Error(`Only ${stock} of "${prodSnap.data()!.name}" left in stock.`);
      }
    }

    const orderRef = ordersCol().doc();
    await tx.set(orderRef, {
      reference: data.reference,
      userId: data.userId,
      email: data.email,
      fullName: data.fullName,
      address: data.address,
      city: data.city,
      postalCode: data.postalCode,
      country: data.country,
      subtotalCents: data.subtotalCents,
      shippingCents: data.shippingCents,
      totalCents: data.totalCents,
      status: "paid",
      createdAt: ts(),
    });

    for (const item of data.items) {
      await tx.set(orderItemsCol().doc(), {
        orderId: orderRef.id,
        productId: item.productId,
        productName: item.productName,
        unitPriceCents: item.unitPriceCents,
        quantity: item.quantity,
      });
    }

    for (const update of data.stockUpdates) {
      await tx.update(productsCol().doc(update.productId), { stock: update.newStock });
    }
  });

  return {
    reference: data.reference,
    total: data.totalCents,
    subtotal: data.subtotalCents,
    shipping: data.shippingCents,
  };
}

// ─── Users ───────────────────────────────────────────────────────────────────

const usersCol = () => db().collection("users");

export async function getUserById(id: string): Promise<User | null> {
  try {
    const snap = await usersCol().doc(id).get();
    return snap.exists ? mapDoc<User>(snap) : null;
  } catch {
    return null;
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const snap = await usersCol().where("email", "==", email).limit(1).get();
    return snap.docs.length > 0 ? mapDoc<User>(snap.docs[0]) : null;
  } catch {
    return null;
  }
}

export async function createUser(id: string, email: string, fullName: string): Promise<User> {
  await usersCol().doc(id).set({ email, fullName, createdAt: ts() });
  return { id, email, fullName, createdAt: new Date() };
}

export async function updateUserFullName(id: string, fullName: string): Promise<void> {
  await usersCol().doc(id).update({ fullName });
}

// ─── Addresses ───────────────────────────────────────────────────────────────

const addressesCol = () => db().collection("addresses");

export async function getUserAddresses(userId: string): Promise<Address[]> {
  try {
    const snap = await addressesCol()
      .where("userId", "==", userId)
      .orderBy("isDefault", "desc")
      .orderBy("createdAt", "desc")
      .get();
    return snap.docs.map((d) => mapDoc<Address>(d));
  } catch {
    return [];
  }
}

export async function createAddress(data: Omit<Address, "id" | "createdAt">): Promise<Address> {
  const ref = await addressesCol().add({ ...data, createdAt: ts() });
  return { ...data, id: ref.id, createdAt: new Date() };
}

export async function deleteAddress(userId: string, addressId: string): Promise<void> {
  const snap = await addressesCol().doc(addressId).get();
  if (snap.exists && snap.data()!.userId === userId) {
    await addressesCol().doc(addressId).delete();
  }
}

export async function unsetDefaultAddresses(userId: string): Promise<void> {
  const snap = await addressesCol().where("userId", "==", userId).where("isDefault", "==", true).get();
  const batch = db().batch();
  for (const doc of snap.docs) {
    batch.update(doc.ref, { isDefault: false });
  }
  await batch.commit();
}

// ─── Wishlist ────────────────────────────────────────────────────────────────

const wishlistCol = () => db().collection("wishlist");

export async function getWishlistItems(userId: string) {
  try {
    const snap = await wishlistCol().where("userId", "==", userId).get();
    const productIds = snap.docs.map((d) => d.data().productId as string);
    if (productIds.length === 0) return [];

    const results: { id: string; slug: string; name: string; priceCents: number; imageUrl: string; stock: number; tagline: string }[] = [];

    for (let i = 0; i < productIds.length; i += 30) {
      const chunk = productIds.slice(i, i + 30);
      const prodSnap = await productsCol().where("__name__", "in", chunk).get();
      for (const d of prodSnap.docs) {
        const data = d.data();
        results.push({ id: d.id, slug: data.slug, name: data.name, priceCents: data.priceCents, imageUrl: data.imageUrl, stock: data.stock, tagline: data.tagline });
      }
    }

    return results;
  } catch {
    return [];
  }
}

export async function toggleWishlist(userId: string, productId: string): Promise<"added" | "removed"> {
  const snap = await wishlistCol().where("userId", "==", userId).where("productId", "==", productId).get();
  if (snap.docs.length > 0) {
    await snap.docs[0].ref.delete();
    return "removed";
  }
  await wishlistCol().add({ userId, productId, createdAt: ts() });
  return "added";
}

// ─── Reviews ─────────────────────────────────────────────────────────────────

const reviewsCol = () => db().collection("reviews");

export async function getReviewsForProduct(productId: string) {
  try {
    const snap = await reviewsCol()
      .where("productId", "==", productId)
      .orderBy("createdAt", "desc")
      .limit(20)
      .get();
    const reviews = snap.docs.map((d) => mapDoc<Review>(d));

    const userIds = [...new Set(reviews.map((r) => r.userId))];
    const userNames = new Map<string, string>();
    for (const uid of userIds) {
      const user = await getUserById(uid);
      userNames.set(uid, user?.fullName ?? "Aura customer");
    }

    return reviews.map((r) => ({
      ...r,
      reviewerName: userNames.get(r.userId) ?? "Aura customer",
    }));
  } catch {
    return [];
  }
}

export async function getReviewSummary(productId: string) {
  const empty = { average: 0, count: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<1 | 2 | 3 | 4 | 5, number> };
  try {
    const snap = await reviewsCol().where("productId", "==", productId).get();
    const reviews = snap.docs.map((d) => d.data());
    if (reviews.length === 0) return empty;

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<1 | 2 | 3 | 4 | 5, number>;
    let total = 0;
    for (const r of reviews) {
      const rating = Math.max(1, Math.min(5, r.rating)) as 1 | 2 | 3 | 4 | 5;
      distribution[rating] += 1;
      total += rating;
    }
    return { average: total / reviews.length, count: reviews.length, distribution };
  } catch {
    return empty;
  }
}

export async function getTopRatedProducts(limit = 4) {
  try {
    const allReviews = await reviewsCol().get();
    const reviews = allReviews.docs.map((d) => d.data());

    const groups = new Map<string, { total: number; count: number }>();
    for (const r of reviews) {
      const pid = r.productId as string;
      const existing = groups.get(pid) ?? { total: 0, count: 0 };
      existing.total += r.rating;
      existing.count += 1;
      groups.set(pid, existing);
    }

    const ranked = [...groups.entries()]
      .map(([productId, g]) => ({ productId, average: g.total / g.count, count: g.count }))
      .sort((a, b) => b.average - a.average)
      .slice(0, limit);

    if (ranked.length === 0) return [];

    const prodIds = ranked.map((r) => r.productId);
    const prodsSnap = await productsCol().where("__name__", "in", prodIds).get();
    const prodMap = new Map(prodsSnap.docs.map((d) => [d.id, mapDoc<Product>(d)]));

    return ranked
      .map((r) => {
        const p = prodMap.get(r.productId);
        if (!p) return null;
        return { product: p, average: r.average, count: r.count };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
  } catch {
    return [];
  }
}

export async function getAllReviews(limit = 30) {
  const emptySummary = { average: 0, count: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<1 | 2 | 3 | 4 | 5, number> };
  try {
    const snap = await reviewsCol().orderBy("createdAt", "desc").limit(limit).get();
    const reviews = snap.docs.map((d) => mapDoc<Review>(d));

    const userIds = [...new Set(reviews.map((r) => r.userId))];
    const productIds = [...new Set(reviews.map((r) => r.productId))];

    const userNames = new Map<string, string>();
    for (const uid of userIds) {
      const user = await getUserById(uid);
      userNames.set(uid, user?.fullName ?? "Aura customer");
    }

    const prodMap = new Map<string, Product>();
    for (let i = 0; i < productIds.length; i += 30) {
      const chunk = productIds.slice(i, i + 30);
      const prodSnap = await productsCol().where("__name__", "in", chunk).get();
      for (const d of prodSnap.docs) {
        prodMap.set(d.id, mapDoc<Product>(d));
      }
    }

    const mapped = reviews.map((r) => {
      const p = prodMap.get(r.productId);
      return {
        ...r,
        reviewerName: userNames.get(r.userId) ?? "Aura customer",
        productName: p?.name ?? "Aura & Earth candle",
        productSlug: p?.slug ?? "",
        productImage: p?.imageUrl ?? "",
      };
    });

    const allSnap = await reviewsCol().get();
    const allReviews = allSnap.docs.map((d) => d.data());
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<1 | 2 | 3 | 4 | 5, number>;
    let total = 0;
    for (const r of allReviews) {
      const rating = Math.max(1, Math.min(5, r.rating)) as 1 | 2 | 3 | 4 | 5;
      distribution[rating] += 1;
      total += rating;
    }
    const summary = allReviews.length === 0 ? emptySummary : { average: total / allReviews.length, count: allReviews.length, distribution };

    return { reviews: mapped, summary };
  } catch {
    return { reviews: [], summary: emptySummary };
  }
}

export async function createReview(data: Omit<Review, "id" | "createdAt">): Promise<Review> {
  const ref = await reviewsCol().add({ ...data, createdAt: ts() });
  return { ...data, id: ref.id, createdAt: new Date() };
}

export async function userHasPurchased(userId: string, productId: string): Promise<boolean> {
  try {
    const snap = await orderItemsCol().where("productId", "==", productId).get();
    const itemOrderIds = snap.docs.map((d) => d.data().orderId as string);
    if (itemOrderIds.length === 0) return false;

    for (let i = 0; i < itemOrderIds.length; i += 30) {
      const chunk = itemOrderIds.slice(i, i + 30);
      const orderSnap = await ordersCol().where("userId", "==", userId).where("__name__", "in", chunk).get();
      if (orderSnap.docs.length > 0) return true;
    }

    return false;
  } catch {
    return false;
  }
}

// ─── Posts ───────────────────────────────────────────────────────────────────

const postsCol = () => db().collection("posts");

export async function getPosts(): Promise<Post[]> {
  try {
    const snap = await postsCol().orderBy("publishedAt", "desc").get();
    return snap.docs.map((d) => mapDoc<Post>(d));
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const snap = await postsCol().where("slug", "==", slug).limit(1).get();
    return snap.docs.length > 0 ? mapDoc<Post>(snap.docs[0]) : null;
  } catch {
    return null;
  }
}

// ─── Contact Messages ────────────────────────────────────────────────────────

const contactCol = () => db().collection("contactMessages");

export async function createContactMessage(data: Omit<ContactMessage, "id" | "createdAt">): Promise<void> {
  await contactCol().add({ ...data, createdAt: ts() });
}

// ─── Health Check ────────────────────────────────────────────────────────────

export async function checkFirestoreConnection(): Promise<boolean> {
  if (!isAdminConfigured()) return false;
  try {
    await db().listCollections();
    return true;
  } catch {
    return false;
  }
}

// ─── Seed Data ───────────────────────────────────────────────────────────────

export async function seedProductsIfEmpty(): Promise<Product[]> {
  if (!isAdminConfigured()) return [];
  const existing = await getProducts();
  if (existing.length > 0) return existing;

  try {
    const { seedProducts } = await import("./seed-data");
    const batch = db().batch();
    for (const p of seedProducts) {
      const ref = productsCol().doc();
      batch.set(ref, { ...p, createdAt: ts() });
    }
    await batch.commit();
    return getProducts();
  } catch {
    return [];
  }
}

export async function seedPostsIfEmpty(): Promise<Post[]> {
  if (!isAdminConfigured()) return [];
  const existing = await getPosts();
  if (existing.length > 0) return existing;

  try {
    const { seedPosts } = await import("./seed-posts");
    const batch = db().batch();
    for (const p of seedPosts) {
      const ref = postsCol().doc();
      batch.set(ref, { ...p, createdAt: ts(), publishedAt: ts() });
    }
    await batch.commit();
    return getPosts();
  } catch {
    return [];
  }
}
