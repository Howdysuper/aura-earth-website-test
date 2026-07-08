import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";

export const metadata: Metadata = { title: "Privacy — Aura & Earth" };

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy policy"
      subtitle="How we collect, use, and protect your information."
      lastUpdated="January 1, 2026"
    >
      <p>
        We collect only the information we need to run Aura &amp; Earth: your
        name, email, shipping address, and order history. We never sell your
        data to third parties, and we only share it with the partners who help
        us ship your candles and process payments.
      </p>
      <h2 className="font-display text-2xl font-semibold text-ink">
        What we collect
      </h2>
      <p>
        Account information (name, email, hashed password), order information
        (items, shipping address, totals), and basic device/usage data via
        privacy-friendly analytics.
      </p>
      <h2 className="font-display text-2xl font-semibold text-ink">
        How we use it
      </h2>
      <p>
        To process orders, ship packages, send you order updates, and—with your
        permission—share new product news. You can unsubscribe from marketing
        emails anytime.
      </p>
      <h2 className="font-display text-2xl font-semibold text-ink">
        Your rights
      </h2>
      <p>
        You can access, correct, or delete your account data at any time.
        Email{" "}
        <a className="text-moss underline" href="mailto:hello@auraandearth.co">
          hello@auraandearth.co
        </a>{" "}
        and we&apos;ll respond within 30 days.
      </p>
    </LegalLayout>
  );
}
