"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";

const FREE_SHIPPING_THRESHOLD = 5000;
const SHIPPING_CENTS = 700;

const fields = [
  { name: "fullName", label: "Full name", type: "text", auto: "name", half: false },
  { name: "email", label: "Email", type: "email", auto: "email", half: false },
  { name: "address", label: "Street address", type: "text", auto: "street-address", half: false },
  { name: "city", label: "City", type: "text", auto: "address-level2", half: true },
  { name: "postalCode", label: "Postal code", type: "text", auto: "postal-code", half: true },
  { name: "country", label: "Country", type: "text", auto: "country-name", half: false },
] as const;

export function CheckoutForm() {
  const { items, subtotalCents, setQuantity, removeItem, clear } = useCart();
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  const shipping =
    items.length === 0
      ? 0
      : subtotalCents >= FREE_SHIPPING_THRESHOLD
        ? 0
        : SHIPPING_CENTS;
  const total = subtotalCents + shipping;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
        }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        clear();
        router.push(`/checkout/success?ref=${encodeURIComponent(data.reference)}`);
      } else {
        setStatus("error");
        setError(data.error ?? "Checkout failed. Please try again.");
      }
    } catch {
      setStatus("error");
      setError("Network error. Please try again.");
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md py-20 text-center">
        <span className="text-6xl">🛒</span>
        <h1 className="mt-6 font-display text-3xl font-semibold text-ink">
          Your cart is empty
        </h1>
        <p className="mt-3 text-ink-soft">
          Add a candle or two and come back to check out.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex rounded-full bg-moss px-7 py-3.5 text-sm font-semibold text-cream-soft transition hover:bg-sage-deep"
        >
          Shop the collection
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
      {/* Form */}
      <form onSubmit={handleSubmit} className="order-2 lg:order-1">
        <h2 className="font-display text-2xl font-semibold text-ink">
          Shipping details
        </h2>
        <p className="mt-1 text-sm text-ink-soft">
          This is a demo checkout—no real payment is taken.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4">
          {fields.map((f) => (
            <div key={f.name} className={f.half ? "col-span-1" : "col-span-2"}>
              <label
                htmlFor={f.name}
                className="mb-1.5 block text-sm font-medium text-ink"
              >
                {f.label}
              </label>
              <input
                id={f.name}
                name={f.name}
                type={f.type}
                required
                autoComplete={f.auto}
                value={form[f.name]}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, [f.name]: e.target.value }))
                }
                className="w-full rounded-xl bg-white px-4 py-3 text-base text-ink ring-1 ring-black/10 outline-none transition focus:ring-2 focus:ring-sage"
              />
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl bg-white/60 p-5 ring-1 ring-black/5">
          <h3 className="text-sm font-semibold text-ink">Payment</h3>
          <p className="mt-1 text-sm text-ink-soft">
            Demo mode — your order will be recorded and inventory updated, but no
            card is charged.
          </p>
          <div className="mt-3 flex gap-2 text-2xl opacity-60">
            💳 🟦 🟧
          </div>
        </div>

        {status === "error" && (
          <p
            role="alert"
            className="mt-4 rounded-xl bg-clay/10 px-4 py-3 text-sm font-medium text-clay"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-moss px-8 py-4 text-base font-semibold text-cream-soft shadow-[var(--shadow-soft)] transition-all duration-300 hover:bg-sage-deep hover:shadow-[var(--shadow-lift)] active:scale-[0.99] disabled:opacity-60"
        >
          {status === "loading"
            ? "Placing order…"
            : `Pay ${formatPrice(total)} →`}
        </button>
        <p className="mt-3 text-center text-xs text-ink-soft">
          🔒 Secure checkout · 30-day returns · Carbon-neutral delivery
        </p>
      </form>

      {/* Summary */}
      <div className="order-1 lg:order-2">
        <div className="rounded-[var(--radius-xl2)] bg-white/70 p-6 ring-1 ring-black/5 backdrop-blur lg:sticky lg:top-28">
          <h2 className="font-display text-2xl font-semibold text-ink">
            Order summary
          </h2>
          <ul className="mt-5 space-y-4">
            {items.map((item) => (
              <li key={item.productId} className="flex gap-4">
                <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl ring-1 ring-black/5">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                  <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-moss px-1 text-[11px] font-bold text-cream-soft">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex flex-1 flex-col">
                  <span className="font-display text-base font-semibold text-ink">
                    {item.name}
                  </span>
                  <span className="text-sm text-ink-soft">
                    {formatPrice(item.priceCents)} each
                  </span>
                  <div className="mt-auto flex items-center gap-3 pt-1">
                    <div className="flex items-center rounded-full ring-1 ring-black/10">
                      <button
                        type="button"
                        onClick={() =>
                          setQuantity(item.productId, item.quantity - 1)
                        }
                        aria-label="Decrease quantity"
                        className="grid h-7 w-7 place-items-center rounded-full text-ink transition hover:bg-black/5"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setQuantity(item.productId, item.quantity + 1)
                        }
                        aria-label="Increase quantity"
                        className="grid h-7 w-7 place-items-center rounded-full text-ink transition hover:bg-black/5 disabled:opacity-30"
                        disabled={item.quantity >= item.stock}
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="text-xs text-ink-soft underline transition hover:text-clay"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <span className="font-semibold text-ink">
                  {formatPrice(item.priceCents * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-6 space-y-2 border-t border-black/5 pt-5 text-sm">
            <div className="flex justify-between text-ink-soft">
              <span>Subtotal</span>
              <span className="font-medium text-ink">
                {formatPrice(subtotalCents)}
              </span>
            </div>
            <div className="flex justify-between text-ink-soft">
              <span>Shipping</span>
              <span className="font-medium text-ink">
                {shipping === 0 ? "Free" : formatPrice(shipping)}
              </span>
            </div>
            <div className="flex justify-between border-t border-black/5 pt-3 text-base">
              <span className="font-semibold text-ink">Total</span>
              <span className="font-display text-xl font-semibold text-ink">
                {formatPrice(total)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
