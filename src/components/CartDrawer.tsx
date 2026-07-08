"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";

const FREE_SHIPPING_THRESHOLD = 5000;

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    setQuantity,
    subtotalCents,
    count,
  } = useCart();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotalCents);
  const progress = Math.min(100, (subtotalCents / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div
      className={`fixed inset-0 z-[60] transition-all duration-500 ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!isOpen}
    >
      <div
        className={`absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity duration-500 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={closeCart}
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-cream-soft shadow-[var(--shadow-lift)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between border-b border-black/5 px-6 py-5">
          <h2 className="font-display text-xl font-semibold text-ink">
            Your cart{count > 0 ? ` (${count})` : ""}
          </h2>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="grid h-9 w-9 place-items-center rounded-full text-ink transition hover:bg-black/5"
          >
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <span className="text-5xl">🕯️</span>
            <p className="font-display text-xl font-semibold text-ink">
              Your cart is empty
            </p>
            <p className="text-sm text-ink-soft">
              Find your next signature scent.
            </p>
            <Link
              href="/shop"
              onClick={closeCart}
              className="mt-2 rounded-full bg-moss px-6 py-3 text-sm font-semibold text-cream-soft transition hover:bg-sage-deep"
            >
              Shop candles
            </Link>
          </div>
        ) : (
          <>
            <div className="border-b border-black/5 px-6 py-4">
              {remaining > 0 ? (
                <p className="text-sm text-ink-soft">
                  You&apos;re{" "}
                  <span className="font-semibold text-moss">
                    {formatPrice(remaining)}
                  </span>{" "}
                  away from free shipping
                </p>
              ) : (
                <p className="text-sm font-semibold text-sage-deep">
                  🎉 You&apos;ve unlocked free carbon-neutral shipping!
                </p>
              )}
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-mist">
                <div
                  className="h-full rounded-full bg-sage transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <ul className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-4">
                  <Link
                    href={`/shop/${item.slug}`}
                    onClick={closeCart}
                    className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl ring-1 ring-black/5"
                  >
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <Link
                        href={`/shop/${item.slug}`}
                        onClick={closeCart}
                        className="font-display text-base font-semibold text-ink hover:underline"
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => removeItem(item.productId)}
                        aria-label={`Remove ${item.name}`}
                        className="text-sm text-ink-soft transition hover:text-clay"
                      >
                        ✕
                      </button>
                    </div>
                    <p className="text-sm text-ink-soft">
                      {formatPrice(item.priceCents)}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center rounded-full ring-1 ring-black/10">
                        <button
                          onClick={() =>
                            setQuantity(item.productId, item.quantity - 1)
                          }
                          aria-label="Decrease quantity"
                          className="grid h-8 w-8 place-items-center rounded-full text-ink transition hover:bg-black/5"
                        >
                          −
                        </button>
                        <span className="w-7 text-center text-sm font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            setQuantity(item.productId, item.quantity + 1)
                          }
                          aria-label="Increase quantity"
                          className="grid h-8 w-8 place-items-center rounded-full text-ink transition hover:bg-black/5 disabled:opacity-30"
                          disabled={item.quantity >= item.stock}
                        >
                          +
                        </button>
                      </div>
                      <span className="font-semibold text-ink">
                        {formatPrice(item.priceCents * item.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-black/5 px-6 py-5">
              <div className="flex items-center justify-between text-base">
                <span className="text-ink-soft">Subtotal</span>
                <span className="font-display text-xl font-semibold text-ink">
                  {formatPrice(subtotalCents)}
                </span>
              </div>
              <p className="mt-1 text-xs text-ink-soft">
                Shipping &amp; taxes calculated at checkout.
              </p>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-moss px-6 py-4 text-base font-semibold text-cream-soft transition-all duration-300 hover:bg-sage-deep hover:shadow-[var(--shadow-lift)]"
              >
                Checkout →
              </Link>
              <Link
                href="/shop"
                onClick={closeCart}
                className="mt-2 block w-full text-center text-sm font-medium text-ink-soft transition hover:text-ink"
              >
                Continue shopping
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
