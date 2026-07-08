import { Reveal } from "./Reveal";
import { SubscribeForm } from "./SubscribeForm";

export function CTA() {
  return (
    <section className="relative px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="relative overflow-hidden rounded-[var(--radius-xl2)] bg-gradient-to-br from-moss via-sage-deep to-moss px-7 py-16 text-center text-cream-soft shadow-[var(--shadow-lift)] sm:px-16 sm:py-20">
            <div className="pointer-events-none absolute inset-0 grain opacity-20" />
            <div className="pointer-events-none absolute -top-20 -right-10 h-72 w-72 rounded-full bg-gold/20 blur-3xl animate-float-slow" />
            <div className="pointer-events-none absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-clay/25 blur-3xl animate-float" />

            <div className="relative mx-auto max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-clay-soft ring-1 ring-white/15">
                Join the ritual
              </span>
              <h2 className="mt-6 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                Get 15% off your first glow
              </h2>
              <p className="mt-5 text-lg text-cream-soft/85">
                Subscribe for early drops, seasonal scents, and a welcome code
                for your first order. No spam—just good light.
              </p>

              <div className="mx-auto mt-8 max-w-md">
                <SubscribeForm
                  plan="newsletter"
                  source="footer-cta"
                  cta="Claim 15% off"
                  variant="dark"
                />
              </div>

              <p className="mt-4 text-xs text-cream-soft/60">
                By subscribing you agree to receive marketing emails. Unsubscribe
                anytime.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
