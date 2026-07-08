import Image from "next/image";
import { Reveal } from "./Reveal";

const points = [
  {
    title: "A mood, not just a scent",
    body: "Each fragrance is layered like a fine perfume—top, heart, and base notes that evolve as the candle burns.",
  },
  {
    title: "Made in small batches",
    body: "Hand-poured by a tiny team in California, so quality is checked candle by candle—never on an assembly line.",
  },
  {
    title: "Designed to be displayed",
    body: "Sculptural stoneware vessels that look intentional on your shelf long after the last flicker fades.",
  },
];

export function Benefits() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2">
        {/* Image collage */}
        <Reveal className="order-2 lg:order-1">
          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-[var(--radius-xl2)] bg-gradient-to-br from-sage/20 to-clay-soft/30 blur-2xl" />
            <div className="grid grid-cols-2 gap-4">
              <div className="overflow-hidden rounded-[var(--radius-xl2)] shadow-[var(--shadow-soft)] ring-1 ring-black/5">
                <Image
                  src="https://images.pexels.com/photos/26997713/pexels-photo-26997713.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=700"
                  alt="Artisan soy candle still life"
                  width={700}
                  height={900}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="mt-10 overflow-hidden rounded-[var(--radius-xl2)] shadow-[var(--shadow-soft)] ring-1 ring-black/5">
                <Image
                  src="https://images.pexels.com/photos/7234544/pexels-photo-7234544.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=700"
                  alt="Hand-pouring a candle in the studio"
                  width={700}
                  height={900}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </div>
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 rounded-2xl glass px-5 py-3 text-center shadow-[var(--shadow-soft)]">
              <p className="font-display text-lg font-semibold text-ink">
                Small-batch, big intention
              </p>
            </div>
          </div>
        </Reveal>

        {/* Copy */}
        <div className="order-1 lg:order-2">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-sage-deep">
              The Aura difference
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              Crafted slowly, so you can{" "}
              <span className="text-gradient">slow down too</span>
            </h2>
          </Reveal>

          <div className="mt-10 space-y-7">
            {points.map((p, i) => (
              <Reveal key={p.title} delay={i * 100}>
                <div className="flex gap-4">
                  <div className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-moss text-sm font-bold text-cream-soft">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-ink">
                      {p.title}
                    </h3>
                    <p className="mt-1.5 text-ink-soft">{p.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <a
              href="#collection"
              className="group mt-10 inline-flex items-center gap-2 rounded-full bg-moss px-7 py-4 text-base font-semibold text-cream-soft transition-all duration-300 hover:bg-sage-deep hover:shadow-[var(--shadow-lift)]"
            >
              Explore the scents
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
