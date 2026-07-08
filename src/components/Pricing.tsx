import { Reveal } from "./Reveal";
import { SubscribeForm } from "./SubscribeForm";

const plans = [
  {
    name: "Single Candle",
    price: "$34",
    cadence: "one-time",
    description: "Try a signature scent, no commitment.",
    features: [
      "One hand-poured soy candle",
      "60+ hours of clean burn",
      "Refillable stoneware vessel",
      "Carbon-neutral shipping",
    ],
    plan: "single",
    featured: false,
  },
  {
    name: "Monthly Candle Box",
    price: "$29",
    cadence: "per month",
    description: "A new seasonal scent at your door, every month.",
    features: [
      "1 exclusive candle each month",
      "Save 15% vs. retail pricing",
      "Members-only scents & gifts",
      "Free shipping, skip or cancel anytime",
      "Surprise add-ons & early drops",
    ],
    plan: "monthly-box",
    featured: true,
  },
  {
    name: "The Ritual (Annual)",
    price: "$290",
    cadence: "per year",
    description: "Best value—two months free, plus extras.",
    features: [
      "12 candles + 2 bonus months",
      "Save 30% vs. retail pricing",
      "Limited-edition annual gift set",
      "Priority access to new releases",
    ],
    plan: "annual-box",
    featured: false,
  },
];

export function Pricing() {
  return (
    <section id="subscription" className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-20 h-96 w-96 -translate-x-1/2 rounded-full bg-sage/15 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-sage-deep">
              The candle box
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              A monthly ritual,{" "}
              <span className="text-gradient">thoughtfully delivered</span>
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-5 text-lg text-ink-soft">
              Choose how you glow. Pause, skip, or cancel anytime—no fine print,
              no guilt.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid items-stretch gap-6 lg:grid-cols-3">
          {plans.map((p, i) => (
            <Reveal key={p.name} delay={i * 100}>
              <div
                className={`relative flex h-full flex-col rounded-[var(--radius-xl2)] p-8 transition-all duration-500 ${
                  p.featured
                    ? "bg-moss text-cream-soft shadow-[var(--shadow-lift)] lg:-translate-y-4 lg:scale-[1.02]"
                    : "bg-white/70 text-ink ring-1 ring-black/5 backdrop-blur hover:-translate-y-1.5 hover:shadow-[var(--shadow-lift)]"
                }`}
              >
                {p.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-4 py-1 text-xs font-bold uppercase tracking-wide text-moss">
                    Most popular
                  </span>
                )}
                <h3
                  className={`font-display text-xl font-semibold ${p.featured ? "" : "text-ink"}`}
                >
                  {p.name}
                </h3>
                <p
                  className={`mt-1.5 text-sm ${p.featured ? "text-cream-soft/75" : "text-ink-soft"}`}
                >
                  {p.description}
                </p>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="font-display text-5xl font-semibold">
                    {p.price}
                  </span>
                  <span
                    className={`text-sm ${p.featured ? "text-cream-soft/70" : "text-ink-soft"}`}
                  >
                    {p.cadence}
                  </span>
                </div>

                <ul className="mt-7 flex-1 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <span
                        className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px] ${
                          p.featured
                            ? "bg-gold text-moss"
                            : "bg-mist text-moss"
                        }`}
                      >
                        ✓
                      </span>
                      <span
                        className={
                          p.featured
                            ? "text-cream-soft/90"
                            : "text-ink-soft"
                        }
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <SubscribeForm
                    plan={p.plan}
                    source={`pricing-${p.plan}`}
                    cta={p.featured ? "Start my box" : "Choose plan"}
                    variant={p.featured ? "dark" : "light"}
                  />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
