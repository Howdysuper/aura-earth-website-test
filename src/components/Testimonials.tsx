import { Reveal } from "./Reveal";

const testimonials = [
  {
    quote:
      "I'm scent-sensitive and most candles give me a headache. Aura & Earth is the first brand I can burn all day. My apartment has never felt so calm.",
    name: "Maya R.",
    role: "Brooklyn, NY",
    initial: "M",
    color: "#7c8a6f",
  },
  {
    quote:
      "The candle box is the highlight of my month. It feels like a tiny luxury that's actually good for me and the planet. The packaging alone is unreal.",
    name: "Jordan T.",
    role: "Austin, TX",
    initial: "J",
    color: "#c98a6b",
  },
  {
    quote:
      "Clean ingredients, gorgeous design, and they last forever. I've converted my whole friend group. These look incredible on my shelf.",
    name: "Priya S.",
    role: "Seattle, WA",
    initial: "P",
    color: "#56654b",
  },
  {
    quote:
      "Finally a sustainable brand that doesn't look crunchy. The Amber Hearth scent is my entire personality now.",
    name: "Alex W.",
    role: "Chicago, IL",
    initial: "A",
    color: "#c8a25c",
  },
];

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-moss py-24 text-cream-soft sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0 grain opacity-20" />
      <div className="pointer-events-none absolute -top-20 right-0 h-96 w-96 rounded-full bg-sage/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 -left-20 h-96 w-96 rounded-full bg-clay/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-clay-soft">
              Loved out loud
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              12,000+ homes that switched for good
            </h2>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 90}>
              <figure className="flex h-full flex-col rounded-3xl glass-dark p-6 transition-transform duration-500 hover:-translate-y-1.5">
                <div className="text-gold">{"★★★★★"}</div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-cream-soft/90">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span
                    className="grid h-10 w-10 place-items-center rounded-full text-sm font-bold text-white"
                    style={{ background: t.color }}
                  >
                    {t.initial}
                  </span>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-cream-soft/60">
                      {t.role}
                    </div>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-12 text-center">
            <a
              href="/reviews"
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-cream-soft ring-1 ring-white/15 backdrop-blur transition hover:bg-white/20"
            >
              Read all reviews
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
