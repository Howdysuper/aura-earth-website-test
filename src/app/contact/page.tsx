import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact — Aura & Earth",
  description: "Get in touch with the Aura & Earth team.",
};

const details = [
  { label: "Email", value: "hello@auraandearth.co" },
  { label: "Phone", value: "+1 (415) 555-0142" },
  { label: "Studio", value: "410 Townsend St, San Francisco" },
  { label: "Hours", value: "Mon–Fri · 9am–5pm PT" },
];

export default function ContactPage() {
  return (
    <main className="relative min-h-screen overflow-x-clip">
      <Navbar />
      <section className="pt-32 pb-12 sm:pt-40">
        <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-sage-deep">
              Get in touch
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight text-ink sm:text-6xl">
              We&apos;d love to hear from you
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-ink-soft">
              Order help, wholesale inquiries, or just want to say hi? Drop us a
              line and we&apos;ll reply within one business day.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-24 sm:pb-32">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 sm:px-8 lg:grid-cols-[1.2fr_0.8fr]">
          <Reveal>
            <div className="rounded-[var(--radius-xl2)] bg-white/70 p-6 ring-1 ring-black/5 sm:p-8">
              <ContactForm />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="space-y-4">
              {details.map((d) => (
                <div
                  key={d.label}
                  className="rounded-2xl bg-white/70 p-5 ring-1 ring-black/5"
                >
                  <p className="text-xs uppercase tracking-wide text-ink-soft">
                    {d.label}
                  </p>
                  <p className="mt-1 font-display text-lg text-ink">
                    {d.value}
                  </p>
                </div>
              ))}
              <div className="rounded-2xl bg-moss p-5 text-cream-soft">
                <p className="font-display text-lg font-semibold">
                  Order help?
                </p>
                <p className="mt-1 text-sm text-cream-soft/85">
                  Most questions are answered instantly in our FAQ.
                </p>
                <a
                  href="/#faq"
                  className="mt-3 inline-block text-sm font-semibold underline-offset-2 hover:underline"
                >
                  Read FAQ →
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
      <Footer />
    </main>
  );
}
