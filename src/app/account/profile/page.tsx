import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { ProfileForm } from "@/components/ProfileForm";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Profile — Aura & Earth",
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/");
  return (
    <main className="relative min-h-screen overflow-x-clip">
      <Navbar />
      <section className="pt-32 pb-24 sm:pt-40">
        <div className="mx-auto max-w-2xl px-5 sm:px-8">
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
              Your profile
            </h1>
          </Reveal>
          <div className="mt-10">
            <ProfileForm initialName={user.fullName} />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
