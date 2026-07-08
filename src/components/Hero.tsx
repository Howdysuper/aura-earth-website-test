import Image from "next/image";
import { Reveal } from "./Reveal";

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24"
    >
      {/* Ambient gradient blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-sage/25 blur-3xl animate-float-slow" />
        <div className="absolute top-40 -right-20 h-[28rem] w-[28rem] rounded-full bg-clay-soft/30 blur-3xl animate-float" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-gold/15 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div className="max-w-xl">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-sage-deep ring-1 ring-black/5 backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-clay" />
              Clean-burning · Plant-based · Carbon-neutral
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-6 font-display text-5xl leading-[1.02] font-semibold tracking-tight text-ink sm:text-6xl lg:text-7xl">
              Light a calmer,{" "}
              <span className="text-gradient animate-shimmer">cleaner</span> home.
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">
              Hand-poured soy candles and conscious home goods—made without
              paraffin, phthalates, or compromise. Designed to make every room
              feel like a deep exhale.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#collection"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-moss px-7 py-4 text-base font-semibold text-cream-soft shadow-[var(--shadow-soft)] transition-all duration-300 hover:bg-sage-deep hover:shadow-[var(--shadow-lift)] active:scale-[0.98]"
              >
                Shop the collection
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>
              <a
                href="#subscription"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white/70 px-7 py-4 text-base font-semibold text-ink ring-1 ring-black/10 backdrop-blur transition-all duration-300 hover:bg-white hover:ring-black/15"
              >
                Join the candle box
              </a>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <div className="mt-10 flex items-center gap-5">
              <div className="flex -space-x-3">
                {["#7c8a6f", "#c98a6b", "#56654b", "#c8a25c"].map((c, i) => (
                  <span
                    key={i}
                    className="grid h-10 w-10 place-items-center rounded-full text-xs font-bold text-white ring-2 ring-cream"
                    style={{ background: c }}
                  >
                    {["A", "M", "J", "K"][i]}
                  </span>
                ))}
              </div>
              <div className="text-sm">
                <div className="flex items-center gap-1 text-gold">
                  {"★★★★★"}
                  <span className="ml-1 font-semibold text-ink">
                    4.9
                  </span>
                </div>
                <p className="text-ink-soft">
                  Loved by 12,000+ conscious homes
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Visual */}
        <Reveal delay={200} className="relative">
          <div className="relative mx-auto max-w-md">
            <div className="absolute inset-0 -z-10 translate-y-6 scale-95 rounded-[var(--radius-xl2)] bg-sage/30 blur-2xl" />
            <div className="relative overflow-hidden rounded-[var(--radius-xl2)] shadow-[var(--shadow-lift)] ring-1 ring-black/5">
              <Image
                src="/images/hero-candle.png"
                alt="Aura & Earth hand-poured soy candle in a matte ceramic vessel surrounded by eucalyptus"
                width={900}
                height={1100}
                priority
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-moss/30 via-transparent to-transparent" />
            </div>

            {/* Floating glass cards */}
            <div className="absolute -left-4 top-10 animate-float rounded-2xl glass px-4 py-3 shadow-[var(--shadow-soft)] sm:-left-8">
              <p className="text-xs font-medium text-ink-soft">
                Burn time
              </p>
              <p className="font-display text-xl font-semibold text-ink">
                60+ hrs
              </p>
            </div>
            <div className="absolute -right-3 bottom-12 animate-float-slow rounded-2xl glass px-4 py-3 shadow-[var(--shadow-soft)] sm:-right-6">
              <p className="text-xs font-medium text-ink-soft">
                Wax
              </p>
              <p className="font-display text-xl font-semibold text-ink">
                100% Soy
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
