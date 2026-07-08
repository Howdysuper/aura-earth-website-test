import { Reveal } from "./Reveal";

const features = [
  {
    icon: "🌿",
    title: "Genuinely clean ingredients",
    body: "100% soy & coconut wax, cotton wicks, and phthalate-free fragrance. No paraffin, no parabens, no mystery chemicals—ever.",
  },
  {
    icon: "🕯️",
    title: "Slow, even, soot-free burn",
    body: "Engineered for a clean melt pool and 60+ hours of glow, so every candle lasts longer and burns cleaner than the rest.",
  },
  {
    icon: "♻️",
    title: "Circular by design",
    body: "Refillable stoneware vessels, recycled packaging, and a take-back program that gives every jar a second life.",
  },
  {
    icon: "🌍",
    title: "Carbon-neutral shipping",
    body: "We plant a tree with every order and offset 100% of delivery emissions—beauty that doesn't cost the earth.",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-sage-deep">
              Why Aura &amp; Earth
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              Beautiful objects you can{" "}
              <span className="text-gradient">actually trust</span>
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-5 text-lg text-ink-soft">
              We obsess over what goes into every candle—and what doesn&apos;t.
              The result is a ritual that&apos;s as kind to your air as it is to
              your aesthetic.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 90}>
              <article className="group h-full rounded-3xl bg-white/70 p-7 ring-1 ring-black/5 backdrop-blur transition-all duration-500 hover:-translate-y-1.5 hover:bg-white hover:shadow-[var(--shadow-lift)]">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-mist text-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                  {f.icon}
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold text-ink">
                  {f.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">
                  {f.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
