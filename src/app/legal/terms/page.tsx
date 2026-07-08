import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";

export const metadata: Metadata = { title: "Terms — Aura & Earth" };

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms of service"
      subtitle="The small print that keeps things clear."
      lastUpdated="January 1, 2026"
    >
      <p>
        By using auraandearth.co you agree to these terms. We may update them
        occasionally—if we do, we&apos;ll post the changes here with a revised
        date.
      </p>
      <h2 className="font-display text-2xl font-semibold text-ink">
        Orders
      </h2>
      <p>
        Prices are listed in USD. We reserve the right to refuse or cancel
        orders in cases of pricing errors, suspected fraud, or stock
        unavailability. We&apos;ll always notify you if that happens.
      </p>
      <h2 className="font-display text-2xl font-semibold text-ink">
        Returns
      </h2>
      <p>
        Unused items can be returned within 30 days for a full refund. Sale
        items are final. See our shipping &amp; returns FAQ for details.
      </p>
      <h2 className="font-display text-2xl font-semibold text-ink">
        Subscriptions
      </h2>
      <p>
        Candle box subscriptions renew automatically each month. You can pause,
        skip, or cancel anytime from your account—no fees, no questions.
      </p>
    </LegalLayout>
  );
}
