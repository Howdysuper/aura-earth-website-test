import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { SearchClient } from "@/components/SearchClient";
import { getProducts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Search — Aura & Earth",
};

export default async function SearchPage() {
  const products = await getProducts();
  return (
    <main className="relative min-h-screen overflow-x-clip">
      <Navbar />
      <section className="pt-32 pb-24 sm:pt-40">
        <Reveal className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-sage-deep">
            Find your scent
          </span>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Search the collection
          </h1>
        </Reveal>
        <div className="mt-10">
          <SearchClient products={products} />
        </div>
      </section>
      <Footer />
    </main>
  );
}
