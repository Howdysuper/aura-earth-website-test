import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CheckoutForm } from "@/components/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout — Aura & Earth",
  description: "Complete your Aura & Earth order.",
};

export default function CheckoutPage() {
  return (
    <main className="relative min-h-screen overflow-x-clip">
      <Navbar />
      <section className="pt-28 pb-24 sm:pt-36 sm:pb-32">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h1 className="mb-10 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Checkout
          </h1>
          <CheckoutForm />
        </div>
      </section>
      <Footer />
    </main>
  );
}
