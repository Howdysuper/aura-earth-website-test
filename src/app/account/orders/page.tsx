import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { getCurrentUser } from "@/lib/auth";
import { getUserOrders } from "@/lib/account";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Orders — Aura & Earth",
  robots: { index: false, follow: false },
};

export default async function OrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/");
  const orders = await getUserOrders(user.id);

  return (
    <main className="relative min-h-screen overflow-x-clip">
      <Navbar />
      <section className="pt-32 pb-24 sm:pt-40">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <Reveal>
            <Link
              href="/account"
              className="text-sm text-ink-soft transition hover:text-ink"
            >
              ← Back to account
            </Link>
          </Reveal>
          <Reveal delay={60}>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              Your orders
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-3 text-ink-soft">
              {orders.length} {orders.length === 1 ? "order" : "orders"} placed.
            </p>
          </Reveal>

          <div className="mt-10 space-y-4">
            {orders.length === 0 ? (
              <div className="rounded-2xl bg-white/70 px-6 py-12 text-center ring-1 ring-black/5">
                <p className="text-ink-soft">No orders yet.</p>
                <Link
                  href="/shop"
                  className="mt-4 inline-flex rounded-full bg-moss px-6 py-3 text-sm font-semibold text-cream-soft transition hover:bg-sage-deep"
                >
                  Shop the collection
                </Link>
              </div>
            ) : (
              orders.map((o, i) => (
                <Reveal key={o.id} delay={i * 60}>
                  <article className="overflow-hidden rounded-2xl bg-white/70 ring-1 ring-black/5 transition hover:shadow-[var(--shadow-soft)]">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 bg-mist/50 px-5 py-4">
                      <div>
                        <p className="font-display text-base font-semibold text-ink">
                          {o.reference}
                        </p>
                        <p className="text-sm text-ink-soft">
                          {new Date(o.createdAt).toLocaleDateString("en-US", {
                            dateStyle: "long",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold text-white ${
                            o.status === "paid" ? "bg-sage" : "bg-clay"
                          }`}
                        >
                          {o.status}
                        </span>
                        <span className="font-display text-lg font-semibold text-ink">
                          {formatPrice(o.totalCents)}
                        </span>
                      </div>
                    </div>
                    <ul className="divide-y divide-black/5">
                      {o.items.map((it) => (
                        <li
                          key={it.id}
                          className="flex items-center justify-between px-5 py-3"
                        >
                          <span className="text-ink">
                            {it.productName}{" "}
                            <span className="text-ink-soft">× {it.quantity}</span>
                          </span>
                          <span className="text-sm text-ink-soft">
                            {formatPrice(it.unitPriceCents * it.quantity)}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="bg-cream-soft/40 px-5 py-3 text-sm text-ink-soft">
                      Shipping to {o.city}, {o.country}
                    </div>
                  </article>
                </Reveal>
              ))
            )}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
