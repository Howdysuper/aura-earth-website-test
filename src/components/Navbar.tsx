"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { useWishlist } from "@/lib/wishlist-context";
import { openAuthModal } from "./AuthModal";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/reviews", label: "Reviews" },
  { href: "/journal", label: "Journal" },
  { href: "/about", label: "Our story" },
  { href: "/faq", label: "FAQ" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { count, openCart } = useCart();
  const { user, logout } = useAuth();
  const { items: wishItems } = useWishlist();
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!accountOpen) return;
    const onClick = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [accountOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between px-5 transition-all duration-500 sm:px-8 ${
          scrolled
            ? "my-2.5 rounded-full glass py-2.5 shadow-[var(--shadow-soft)] sm:my-3"
            : "py-4 sm:py-5"
        }`}
      >
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="relative grid h-9 w-9 place-items-center rounded-full bg-moss text-cream-soft">
            <span className="block h-2 w-2 animate-[flame_2.6s_ease-in-out_infinite] rounded-full bg-gold" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-ink">
            Aura&nbsp;&amp;&nbsp;Earth
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group relative text-sm font-medium text-ink-soft transition-colors hover:text-ink"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-sage transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/search"
            aria-label="Search"
            className="grid h-10 w-10 place-items-center rounded-full text-ink transition hover:bg-black/5"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </Link>

          <Link
            href="/wishlist"
            aria-label={`Wishlist, ${wishItems.length} items`}
            className="relative hidden h-10 w-10 place-items-center rounded-full text-ink transition hover:bg-black/5 sm:grid"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
            </svg>
            {wishItems.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-clay px-1 text-[11px] font-bold text-white">
                {wishItems.length}
              </span>
            )}
          </Link>

          <button
            onClick={openCart}
            aria-label={`Open cart, ${count} items`}
            className="relative grid h-10 w-10 place-items-center rounded-full text-ink transition hover:bg-black/5"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-clay px-1 text-[11px] font-bold text-white">
                {count}
              </span>
            )}
          </button>

          {/* Account */}
          <div ref={accountRef} className="relative">
            <button
              onClick={() => {
                if (user) setAccountOpen((v) => !v);
                else openAuthModal("login");
              }}
              aria-label="Account"
              aria-expanded={accountOpen}
              className="grid h-10 w-10 place-items-center rounded-full bg-cream-soft text-ink ring-1 ring-black/10 transition hover:bg-mist"
            >
              {user ? (
                <span className="font-display text-sm font-semibold text-moss">
                  {user.fullName
                    .split(" ")
                    .map((p) => p[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </span>
              ) : (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              )}
            </button>
            {user && accountOpen && (
              <div className="absolute right-0 top-12 w-64 origin-top-right rounded-2xl glass p-2 shadow-[var(--shadow-lift)]">
                <div className="border-b border-black/5 px-3 py-3">
                  <p className="font-display text-sm font-semibold text-ink">
                    {user.fullName}
                  </p>
                  <p className="truncate text-xs text-ink-soft">{user.email}</p>
                </div>
                <div className="py-1">
                  <Link
                    href="/account"
                    onClick={() => setAccountOpen(false)}
                    className="block rounded-xl px-3 py-2 text-sm text-ink transition hover:bg-white/60"
                  >
                    My account
                  </Link>
                  <Link
                    href="/account/orders"
                    onClick={() => setAccountOpen(false)}
                    className="block rounded-xl px-3 py-2 text-sm text-ink transition hover:bg-white/60"
                  >
                    Orders
                  </Link>
                  <Link
                    href="/wishlist"
                    onClick={() => setAccountOpen(false)}
                    className="block rounded-xl px-3 py-2 text-sm text-ink transition hover:bg-white/60"
                  >
                    Wishlist
                  </Link>
                  <Link
                    href="/account/addresses"
                    onClick={() => setAccountOpen(false)}
                    className="block rounded-xl px-3 py-2 text-sm text-ink transition hover:bg-white/60"
                  >
                    Address book
                  </Link>
                </div>
                <div className="border-t border-black/5 pt-1">
                  <button
                    onClick={async () => {
                      await logout();
                      setAccountOpen(false);
                    }}
                    className="block w-full rounded-xl px-3 py-2 text-left text-sm text-ink transition hover:bg-white/60"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>

          <Link
            href="/shop"
            className="hidden rounded-full bg-moss px-5 py-2.5 text-sm font-semibold text-cream-soft transition-all duration-300 hover:bg-sage-deep hover:shadow-[var(--shadow-lift)] lg:inline-flex"
          >
            Shop now
          </Link>

          <button
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full text-ink transition hover:bg-black/5 md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <div className="space-y-1.5">
              <span
                className={`block h-0.5 w-5 bg-current transition-all duration-300 ${open ? "translate-y-2 rotate-45" : ""}`}
              />
              <span
                className={`block h-0.5 w-5 bg-current transition-all duration-300 ${open ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-0.5 w-5 bg-current transition-all duration-300 ${open ? "-translate-y-2 -rotate-45" : ""}`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 top-0 z-40 transition-all duration-500 md:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div
          className="absolute inset-0 bg-ink/30 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
        <div
          className={`absolute inset-x-3 top-20 rounded-3xl glass p-6 shadow-[var(--shadow-lift)] transition-all duration-500 ${
            open ? "translate-y-0" : "-translate-y-4"
          }`}
        >
          <nav className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3.5 text-lg font-medium text-ink transition hover:bg-white/60"
              >
                {l.label}
              </Link>
            ))}
            <div className="my-2 h-px bg-black/5" />
            {user ? (
              <>
                <Link
                  href="/account"
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-4 py-3 text-base font-medium text-ink transition hover:bg-white/60"
                >
                  My account
                </Link>
                <Link
                  href="/wishlist"
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-4 py-3 text-base font-medium text-ink transition hover:bg-white/60"
                >
                  Wishlist
                </Link>
                <Link
                  href="/search"
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-4 py-3 text-base font-medium text-ink transition hover:bg-white/60"
                >
                  Search
                </Link>
                <button
                  onClick={async () => {
                    await logout();
                    setOpen(false);
                  }}
                  className="rounded-2xl px-4 py-3 text-left text-base font-medium text-ink transition hover:bg-white/60"
                >
                  Sign out
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setOpen(false);
                  openAuthModal("login");
                }}
                className="rounded-2xl bg-moss px-4 py-3 text-left text-base font-semibold text-cream-soft transition hover:bg-sage-deep"
              >
                Sign in
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
