import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { AddressBook } from "@/components/AddressBook";
import { getCurrentUser } from "@/lib/auth";
import { getUserAddresses } from "@/lib/account";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Address book — Aura & Earth",
  robots: { index: false, follow: false },
};

export default async function AddressesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/");
  const addresses = await getUserAddresses(user.id);

  return (
    <main className="relative min-h-screen overflow-x-clip">
      <Navbar />
      <section className="pt-32 pb-24 sm:pt-40">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <Reveal>
            <Link
              href="/account"
              className="text-sm text-ink-soft transition hover:text-ink"
            >
              ← Back to account
            </Link>
          </Reveal>
          <Reveal delay={60}>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              Address book
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-3 text-ink-soft">
              Saved addresses speed up checkout and make gift orders a breeze.
            </p>
          </Reveal>
          <div className="mt-10">
            <AddressBook
              initialAddresses={addresses}
              defaultName={user.fullName}
              defaultCountry="USA"
            />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
