import Link from "next/link";

const groups = [
  {
    title: "Shop",
    links: [
      { label: "All candles", href: "/shop" },
      { label: "Search", href: "/search" },
      { label: "Wishlist", href: "/wishlist" },
      { label: "Monthly box", href: "/#subscription" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Our story", href: "/about" },
      { label: "Sustainability", href: "/sustainability" },
      { label: "Journal", href: "/journal" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Reviews", href: "/reviews" },
      { label: "My account", href: "/account" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/legal/privacy" },
      { label: "Terms", href: "/legal/terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-black/5 bg-cream-soft pt-16 pb-10">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-moss">
                <span className="block h-2 w-2 rounded-full bg-gold" />
              </span>
              <span className="font-display text-lg font-semibold text-ink">
                Aura &amp; Earth
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">
              Conscious candles and home goods for people who care what they
              breathe—and how it looks doing it.
            </p>
            <div className="mt-5 flex gap-3">
              {["Instagram", "TikTok", "Pinterest"].map((s) => (
                <a
                  key={s}
                  href="#"
                  aria-label={s}
                  className="grid h-9 w-9 place-items-center rounded-full bg-white text-xs font-semibold text-ink-soft ring-1 ring-black/5 transition hover:bg-moss hover:text-cream-soft"
                >
                  {s[0]}
                </a>
              ))}
            </div>
          </div>

          {groups.map((g) => (
            <div key={g.title}>
              <h3 className="text-sm font-semibold text-ink">{g.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {g.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-ink-soft transition-colors hover:text-ink"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-black/5 pt-7 text-sm text-ink-soft sm:flex-row">
          <p>
            © {new Date().getFullYear()} Aura &amp; Earth. Made with care &amp;
            clean wax.
          </p>
          <div className="flex gap-6">
            <a href="#" className="transition hover:text-ink">
              Privacy
            </a>
            <a href="#" className="transition hover:text-ink">
              Terms
            </a>
            <a href="#" className="transition hover:text-ink">
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
