import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { getOrderByReference, formatPrice } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order confirmed — Aura & Earth",
};

type SearchParams = { searchParams: Promise<{ ref?: string }> };

export default async function SuccessPage({ searchParams }: SearchParams) {
  const { ref } = await searchParams;
  const data = ref ? await getOrderByReference(ref) : null;

  return (
    <main className="relative min-h-screen overflow-x-clip">
      <Navbar />
      <section className="relative overflow-hidden pt-32 pb-24 sm:pt-40 sm:pb-32">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-10 h-96 w-96 -translate-x-1/2 rounded-full bg-sage/20 blur-3xl animate-float-slow" />
        </div>
        <div className="mx-auto max-w-2xl px-5 sm:px-8">
          <Reveal className="text-center">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-moss text-4xl text-cream-soft shadow-[var(--shadow-lift)]">
              ✓
            </div>
            <h1 className="mt-7 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              Thank you{data ? `, ${data.order.fullName.split(" ")[0]}` : ""}!
            </h1>
            <p className="mt-4 text-lg text-ink-soft">
              Your order is confirmed and your candles are being hand-packed with
              care. A receipt is on its way to your inbox.
            </p>
          </Reveal>

          {data ? (
            <Reveal delay={120}>
              <div className="mt-10 rounded-[var(--radius-xl2)] bg-white/70 p-6 text-left ring-1 ring-black/5 backdrop-blur sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/5 pb-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-ink-soft">
                      Order reference
                    </p>
                    <p className="font-display text-xl font-semibold text-ink">
                      {data.order.reference}
                    </p>
                  </div>
                  <span className="rounded-full bg-sage px-3 py-1 text-xs font-semibold text-white">
                    {data.order.status === "paid" ? "Paid" : data.order.status}
                  </span>
                </div>

                <ul className="space-y-3 py-4">
                  {data.items.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-ink">
                        {item.productName}{" "}
                        <span className="text-ink-soft">× {item.quantity}</span>
                      </span>
                      <span className="font-medium text-ink">
                        {formatPrice(item.unitPriceCents * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="space-y-2 border-t border-black/5 pt-4 text-sm">
                  <div className="flex justify-between text-ink-soft">
                    <span>Subtotal</span>
                    <span>{formatPrice(data.order.subtotalCents)}</span>
                  </div>
                  <div className="flex justify-between text-ink-soft">
                    <span>Shipping</span>
                    <span>
                      {data.order.shippingCents === 0
                        ? "Free"
                        : formatPrice(data.order.shippingCents)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-black/5 pt-2 text-base">
                    <span className="font-semibold text-ink">Total</span>
                    <span className="font-display text-lg font-semibold text-ink">
                      {formatPrice(data.order.totalCents)}
                    </span>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl bg-mist/60 p-4 text-sm text-ink-soft">
                  Shipping to{" "}
                  <span className="font-medium text-ink">
                    {data.order.address}, {data.order.city},{" "}
                    {data.order.postalCode}, {data.order.country}
                  </span>
                </div>
              </div>
            </Reveal>
          ) : (
            <Reveal delay={120}>
              <p className="mt-8 text-center text-ink-soft">
                We couldn&apos;t find that order reference, but if you completed
                checkout your order is safe with us.
              </p>
            </Reveal>
          )}

          <Reveal delay={180} className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-full bg-moss px-7 py-3.5 text-sm font-semibold text-cream-soft transition hover:bg-sage-deep"
            >
              Continue shopping
            </Link>
            <Link
              href="/#subscription"
              className="inline-flex items-center justify-center rounded-full bg-white/70 px-7 py-3.5 text-sm font-semibold text-ink ring-1 ring-black/10 transition hover:bg-white"
            >
              Join the candle box
            </Link>
          </Reveal>
        </div>
      </section>
      <Footer />
    </main>
  );
}
