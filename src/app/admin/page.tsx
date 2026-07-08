import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { InventoryEditor } from "@/components/InventoryEditor";
import { getAdminData } from "@/lib/admin";
import { formatPrice } from "@/lib/queries";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Dashboard — Aura & Earth",
  robots: { index: false, follow: false },
};

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

function fmtDate(d: Date) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?redirect=/admin");
  }

  if (ADMIN_EMAILS.length > 0 && !ADMIN_EMAILS.includes(user.email?.toLowerCase() ?? "")) {
    redirect("/?error=unauthorized");
  }

  const data = await getAdminData();

  const stats = [
    { label: "Revenue", value: formatPrice(data.stats.revenueCents) },
    { label: "Orders", value: data.stats.orderCount.toString() },
    { label: "Subscribers", value: data.stats.subscriberCount.toString() },
    { label: "Units in stock", value: data.stats.unitsInStock.toString() },
    { label: "Low-stock items", value: data.stats.lowStock.toString() },
  ];

  return (
    <main className="min-h-screen bg-cream">
      <header className="border-b border-black/5 bg-cream-soft">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-moss">
              <span className="block h-2 w-2 rounded-full bg-gold" />
            </span>
            <div>
              <p className="font-display text-lg font-semibold text-ink">
                Aura &amp; Earth
              </p>
              <p className="-mt-0.5 text-xs text-ink-soft">Admin dashboard</p>
            </div>
          </div>
          <Link
            href="/"
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink ring-1 ring-black/10 transition hover:bg-mist"
          >
            ← Back to site
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-10 px-5 py-10 sm:px-8">
        {!data.available && (
          <div className="rounded-2xl bg-clay/10 px-5 py-4 text-sm font-medium text-clay">
            Database not reachable. Showing empty state—run{" "}
            <code>npx drizzle-kit push</code> to provision tables.
          </div>
        )}

        {/* Stats */}
        <section>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
            Overview
          </h1>
          <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-5">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl bg-white/70 p-5 ring-1 ring-black/5"
              >
                <p className="text-xs uppercase tracking-wide text-ink-soft">
                  {s.label}
                </p>
                <p className="mt-1.5 font-display text-3xl font-semibold text-moss">
                  {s.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Inventory */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl font-semibold text-ink">
              Inventory
            </h2>
            <span className="text-sm text-ink-soft">
              {data.products.length} products
            </span>
          </div>
          {data.products.length > 0 ? (
            <InventoryEditor products={data.products} />
          ) : (
            <p className="rounded-2xl bg-white/70 px-5 py-8 text-center text-ink-soft ring-1 ring-black/5">
              No products yet. Visit the storefront to seed the catalog.
            </p>
          )}
        </section>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Recent orders */}
          <section>
            <h2 className="mb-4 font-display text-2xl font-semibold text-ink">
              Recent orders
            </h2>
            <div className="overflow-hidden rounded-2xl bg-white/70 ring-1 ring-black/5">
              {data.recentOrders.length > 0 ? (
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-black/5 text-xs uppercase tracking-wide text-ink-soft">
                      <th className="px-5 py-3 font-semibold">Ref</th>
                      <th className="px-5 py-3 font-semibold">Customer</th>
                      <th className="px-5 py-3 font-semibold">Items</th>
                      <th className="px-5 py-3 font-semibold text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentOrders.map((o) => (
                      <tr
                        key={o.id}
                        className="border-b border-black/5 last:border-0"
                      >
                        <td className="px-5 py-3 font-medium text-ink">
                          {o.reference}
                          <div className="text-xs font-normal text-ink-soft">
                            {fmtDate(o.createdAt)}
                          </div>
                        </td>
                        <td className="px-5 py-3 text-ink-soft">
                          {o.fullName}
                          <div className="text-xs">{o.email}</div>
                        </td>
                        <td className="px-5 py-3 text-ink-soft">{o.itemCount}</td>
                        <td className="px-5 py-3 text-right font-semibold text-ink">
                          {formatPrice(o.totalCents)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="px-5 py-8 text-center text-ink-soft">
                  No orders yet.
                </p>
              )}
            </div>
          </section>

          {/* Subscribers */}
          <section>
            <h2 className="mb-4 font-display text-2xl font-semibold text-ink">
              Subscribers
            </h2>
            <div className="overflow-hidden rounded-2xl bg-white/70 ring-1 ring-black/5">
              {data.subscribers.length > 0 ? (
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-black/5 text-xs uppercase tracking-wide text-ink-soft">
                      <th className="px-5 py-3 font-semibold">Email</th>
                      <th className="px-5 py-3 font-semibold">Plan</th>
                      <th className="px-5 py-3 font-semibold text-right">
                        Joined
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.subscribers.map((s) => (
                      <tr
                        key={s.id}
                        className="border-b border-black/5 last:border-0"
                      >
                        <td className="px-5 py-3 font-medium text-ink">
                          {s.email}
                        </td>
                        <td className="px-5 py-3">
                          <span className="rounded-full bg-mist px-2.5 py-1 text-xs font-semibold text-moss">
                            {s.plan}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right text-ink-soft">
                          {fmtDate(s.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="px-5 py-8 text-center text-ink-soft">
                  No subscribers yet.
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
