import type { ReviewSummary } from "@/lib/reviews";

export type FallbackReview = {
  id: string;
  rating: number;
  title: string;
  body: string;
  verifiedPurchase: boolean;
  createdAt: string;
  reviewerName: string;
  productName: string;
  productSlug: string;
  productImage: string;
};

// Shown only when the database has no reviews yet, so the page is never empty.
export const fallbackReviews: FallbackReview[] = [
  {
    id: "1001",
    rating: 5,
    title: "My new go-to candle",
    body: "I'm scent-sensitive and most candles give me a headache. This is the first brand I can burn all day. My apartment has never felt so calm and the throw is incredible.",
    verifiedPurchase: true,
    createdAt: "2026-01-14",
    reviewerName: "Maya R.",
    productName: "Morning Eucalyptus",
    productSlug: "morning-eucalyptus",
    productImage:
      "https://images.pexels.com/photos/26872410/pexels-photo-26872410.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  },
  {
    id: "1002",
    rating: 5,
    title: "The box is the highlight of my month",
    body: "The candle box feels like a tiny luxury that's actually good for me and the planet. The packaging alone is unreal, and every scent has been a winner.",
    verifiedPurchase: true,
    createdAt: "2026-01-28",
    reviewerName: "Jordan T.",
    productName: "Amber Hearth",
    productSlug: "amber-hearth",
    productImage:
      "https://images.pexels.com/photos/8471629/pexels-photo-8471629.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  },
  {
    id: "1003",
    rating: 5,
    title: "Finally, a sustainable brand that doesn't look crunchy",
    body: "Clean ingredients, gorgeous design, and they last forever. I've converted my whole friend group. These look incredible on my shelf.",
    verifiedPurchase: true,
    createdAt: "2026-02-02",
    reviewerName: "Priya S.",
    productName: "Wild Fig Orchard",
    productSlug: "wild-fig-orchard",
    productImage:
      "https://images.pexels.com/photos/26997713/pexels-photo-26997713.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  },
  {
    id: "1004",
    rating: 4,
    title: "Obsessed with the scent",
    body: "The Amber Hearth is my entire personality now. Only knocking off a star because I wish the jar was a touch bigger—it burns so beautifully I want it to last forever.",
    verifiedPurchase: true,
    createdAt: "2026-02-11",
    reviewerName: "Alex W.",
    productName: "Amber Hearth",
    productSlug: "amber-hearth",
    productImage:
      "https://images.pexels.com/photos/8471629/pexels-photo-8471629.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  },
  {
    id: "1005",
    rating: 5,
    title: "Fresh, clean, and so calming",
    body: "Quiet Linen smells exactly like sun-dried sheets on a slow Sunday. I light it every morning while I journal. The burn is perfectly even and soot-free.",
    verifiedPurchase: true,
    createdAt: "2026-02-20",
    reviewerName: "Dana K.",
    productName: "Quiet Linen",
    productSlug: "quiet-linen",
    productImage:
      "https://images.pexels.com/photos/5933780/pexels-photo-5933780.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  },
  {
    id: "1006",
    rating: 5,
    title: "Best gift I've given all year",
    body: "Bought three of these as housewarming gifts and every single recipient texted me about how beautiful the packaging was. The vessels are stunning.",
    verifiedPurchase: true,
    createdAt: "2026-03-01",
    reviewerName: "Sam L.",
    productName: "Wild Fig Orchard",
    productSlug: "wild-fig-orchard",
    productImage:
      "https://images.pexels.com/photos/26997713/pexels-photo-26997713.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  },
];

export const fallbackReviewSummary: ReviewSummary = {
  average: 4.9,
  count: 12042,
  distribution: { 1: 24, 2: 58, 3: 210, 4: 1750, 5: 10000 },
};
