import { Reveal } from "./Reveal";

const press = [
  "VOGUE",
  "Architectural Digest",
  "GOOP",
  "Kinfolk",
  "The Cut",
  "Domino",
  "Wallpaper*",
];

const stats = [
  { value: "12k+", label: "Five-star reviews" },
  { value: "100%", label: "Plant-based wax" },
  { value: "0", label: "Toxins & phthalates" },
  { value: "48k", label: "Trees planted" },
];

export function SocialProof() {
  return (
    <section className="relative border-y border-black/5 bg-cream-soft/60 py-12">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-ink-soft">
            As seen in
          </p>
        </Reveal>

        <div className="relative mt-7 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div className="flex w-max animate-marquee items-center gap-14 pr-14">
            {[...press, ...press].map((name, i) => (
              <span
                key={i}
                className="font-display text-xl font-semibold text-ink/35 transition-colors hover:text-ink/70 sm:text-2xl"
              >
                {name}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 80} className="text-center">
              <div className="font-display text-4xl font-semibold text-moss sm:text-5xl">
                {s.value}
              </div>
              <div className="mt-1 text-sm text-ink-soft">
                {s.label}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
