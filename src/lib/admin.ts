import "server-only";
import {
  getProducts,
  getRecentOrders,
  getSubscribers,
  getOrderStats,
  getSubscriberCount,
  isAdminConfigured,
  type Product,
  type Order,
  type Subscriber,
} from "./firestore";

export type AdminData = {
  products: Product[];
  recentOrders: (Order & { itemCount: number })[];
  subscribers: Subscriber[];
  stats: {
    revenueCents: number;
    orderCount: number;
    subscriberCount: number;
    lowStock: number;
    unitsInStock: number;
  };
  available: boolean;
};

export async function getAdminData(): Promise<AdminData> {
  if (!isAdminConfigured()) {
    return {
      products: [],
      recentOrders: [],
      subscribers: [],
      stats: { revenueCents: 0, orderCount: 0, subscriberCount: 0, lowStock: 0, unitsInStock: 0 },
      available: false,
    };
  }

  try {
    const [productRows, orderRows, subscriberRows, revenueStats, subCount] =
      await Promise.all([
        getProducts(),
        getRecentOrders(),
        getSubscribers(),
        getOrderStats(),
        getSubscriberCount(),
      ]);

    return {
      products: productRows,
      recentOrders: orderRows,
      subscribers: subscriberRows,
      stats: {
        revenueCents: revenueStats.revenueCents,
        orderCount: revenueStats.orderCount,
        subscriberCount: subCount,
        lowStock: productRows.filter((p) => p.stock > 0 && p.stock <= 20).length,
        unitsInStock: productRows.reduce((sum, p) => sum + p.stock, 0),
      },
      available: true,
    };
  } catch {
    return {
      products: [],
      recentOrders: [],
      subscribers: [],
      stats: { revenueCents: 0, orderCount: 0, subscriberCount: 0, lowStock: 0, unitsInStock: 0 },
      available: false,
    };
  }
}
