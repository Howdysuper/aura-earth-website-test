export type SeedProduct = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  scentNotes: string;
  priceCents: number;
  imageUrl: string;
  badge: string | null;
  stock: number;
  burnHours: number;
  sortOrder: number;
};

export const seedProducts: SeedProduct[] = [
  {
    slug: "morning-eucalyptus",
    name: "Morning Eucalyptus",
    tagline: "A clean, dewy wake-up for any room.",
    description:
      "Like throwing open the windows after spring rain. Morning Eucalyptus pairs cool, mentholated eucalyptus leaf with a whisper of sea salt and grounding white cedar—an instant reset for foggy mornings and busy minds. Hand-poured in small batches with 100% soy and coconut wax for a clean, even burn.",
    scentNotes: "Eucalyptus · Sea Salt · White Cedar",
    priceCents: 3400,
    imageUrl:
      "https://images.pexels.com/photos/26872410/pexels-photo-26872410.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    badge: "Bestseller",
    stock: 42,
    burnHours: 60,
    sortOrder: 1,
  },
  {
    slug: "amber-hearth",
    name: "Amber Hearth",
    tagline: "Golden hour, captured in soy wax.",
    description:
      "The scent of a slow evening winding down. Warm amber and vanilla bean melt into smoked oak for a cozy, enveloping glow that turns any room into a retreat. Our most-gifted scent—rich without ever being heavy.",
    scentNotes: "Warm Amber · Vanilla Bean · Smoked Oak",
    priceCents: 3600,
    imageUrl:
      "https://images.pexels.com/photos/8471629/pexels-photo-8471629.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    badge: "Limited",
    stock: 18,
    burnHours: 65,
    sortOrder: 2,
  },
  {
    slug: "wild-fig-orchard",
    name: "Wild Fig Orchard",
    tagline: "Lush, green, and quietly luxurious.",
    description:
      "A walk through a sun-warmed orchard. Ripe black fig and tart cassis are lifted by crushed mint for a scent that's fresh, fruity, and unmistakably sophisticated. A modern classic for the design-led home.",
    scentNotes: "Black Fig · Cassis · Crushed Mint",
    priceCents: 3400,
    imageUrl:
      "https://images.pexels.com/photos/26997713/pexels-photo-26997713.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    badge: null,
    stock: 56,
    burnHours: 60,
    sortOrder: 3,
  },
  {
    slug: "quiet-linen",
    name: "Quiet Linen",
    tagline: "Like sun-dried sheets on a slow Sunday.",
    description:
      "Soft, airy, and impossibly comforting. Cotton blossom and lily drift over a clean musk base for a fragrance that feels like fresh laundry and afternoon light. The everyday candle you'll never want to be without.",
    scentNotes: "Cotton Blossom · Lily · Soft Musk",
    priceCents: 3200,
    imageUrl:
      "https://images.pexels.com/photos/5933780/pexels-photo-5933780.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    badge: "New",
    stock: 73,
    burnHours: 58,
    sortOrder: 4,
  },
];
