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
  title: "My account — Aura & Earth",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const orders = await getUserOrders(user.id);
  const totalSpent = orders.reduce((sum, o) => sum + o.totalCents, 0);
  const firstName = user.fullName.split(" ")[0];

  return (
    <main className="relative min-h-screen overflow-x-clip">
      <Navbar />
      <section className="pt-32 pb-20 sm:pt-40">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sage-deep">
              Welcome back
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              Hi, {firstName} 👋
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-3 text-ink-soft">
              Manage your orders, addresses, and saved scents in one place.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/70 p-5 ring-1 ring-black/5">
              <p className="text-xs uppercase tracking-wide text-ink-soft">
                Total spent
              </p>
              <p className="mt-1.5 font-display text-3xl font-semibold text-moss">
                {formatPrice(totalSpent)}
              </p>
            </div>
            <div className="rounded-2xl bg-white/70 p-5 ring-1 ring-black/5">
              <p className="text-xs uppercase tracking-wide text-ink-soft">
                Orders placed
              </p>
              <p className="mt-1.5 font-display text-3xl font-semibold text-moss">
                {orders.length}
              </p>
            </div>
            <div className="rounded-2xl bg-white/70 p-5 ring-1 ring-black/5">
              <p className="text-xs uppercase tracking-wide text-ink-soft">
                Member since
              </p>
              <p className="mt-1.5 font-display text-3xl font-semibold text-moss">
                {user.createdAt ? new Date(user.createdAt).getFullYear() : "—"}
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { href: "/account/orders", label: "Orders", icon: "📦" },
              { href: "/wishlist", label: "Wishlist", icon: "♥" },
              { href: "/account/addresses", label: "Addresses", icon: "🏠" },
              { href: "/account/profile", label: "Profile", icon: "✎" },
            ].map((c, i) => (
              <Reveal key={c.href} delay={i * 60}>
                <Link
                  href={c.href}
                  className="group flex items-center gap-4 rounded-2xl bg-white/70 p-5 ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-mist text-2xl transition group-hover:scale-110">
                    {c.icon}
                  </span>
                  <div>
                    <p className="font-display text-lg font-semibold text-ink">
                      {c.label}
                    </p>
                    <p className="text-sm text-ink-soft group-hover:text-ink">
                      Manage →
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <div className="mt-12">
            <h2 className="font-display text-2xl font-semibold text-ink">
              Recent orders
            </h2>
            <div className="mt-4 overflow-hidden rounded-2xl bg-white/70 ring-1 ring-black/5">
              {orders.length === 0 ? (
                <div className="p-8 text-center text-ink-soft">
                  You haven&apos;t placed any orders yet.{" "}
                  <Link
                    href="/shop"
                    className="font-semibold text-moss underline-offset-2 hover:underline"
                  >
                    Find your first candle →
                  </Link>
                </div>
              ) : (
                <ul>
                  {orders.slice(0, 5).map((o, i) => (
                    <li
                      key={o.id}
                      className={`flex flex-wrap items-center justify-between gap-3 px-5 py-4 ${
                        i !== 0 ? "border-t border-black/5" : ""
                      }`}
                    >
                      <div>
                        <p className="font-display text-base font-semibold text-ink">
                          {o.reference}
                        </p>
                        <p className="text-sm text-ink-soft">
                          {new Date(o.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}{" "}
                          · {o.items.reduce((s, i) => s + i.quantity, 0)} items
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold text-white ${
                            o.status === "paid" ? "bg-sage" : "bg-mist text-ink"
                          }`}
                        >
                          {o.status}
                        </span>
                        <span className="font-semibold text-ink">
                          {formatPrice(o.totalCents)}
                        </span>
                        <Link
                          href="/account/orders"
                          className="text-sm font-medium text-moss underline-offset-2 hover:underline"
                        >
                          View
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
