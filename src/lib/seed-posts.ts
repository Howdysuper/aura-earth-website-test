export type SeedPost = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  coverImage: string;
  category: string;
  author: string;
  readMinutes: number;
  publishedAt: Date;
};

export const seedPosts: SeedPost[] = [
  {
    slug: "why-soy",
    title: "Why we only pour soy & coconut wax",
    excerpt:
      "The wax inside a candle is the difference between breathing clean air and polluting your living room. Here's the science behind our blend.",
    body:
      "Most mass-market candles are made with paraffin—a petroleum byproduct. When burned, paraffin can release volatile organic compounds (VOCs) like toluene and benzene, the same chemicals you'd find in car exhaust. We blend 100% soy and coconut wax instead.\n\nSoy burns cooler and slower, giving our candles their 60+ hour life. Coconut wax adds a creamy, even melt pool and helps the fragrance throw without overwhelming a room. The result: a candle that's as kind to your air as it is to your aesthetic.\n\nIt's a more expensive way to make a candle. We think it's the only way.",
    coverImage:
      "https://images.pexels.com/photos/7234544/pexels-photo-7234544.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    category: "Ingredients",
    author: "Aura & Earth",
    readMinutes: 4,
    publishedAt: new Date("2025-09-12"),
  },
  {
    slug: "slow-sundays",
    title: "A modern ritual for slower Sundays",
    excerpt:
      "Why the most design-obsessed people are reaching for the same three things: a candle, a book, and an hour with no screen.",
    body:
      "Slow living isn't about doing less—it's about choosing what to do with intention. Our founder started Aura & Earth on a Sunday morning with a single candle, a paperback, and the realization that the best part of the week was a 60-minute window where she was nowhere she needed to be.\n\nThat ritual scales beautifully. Light a candle. Make the coffee. Sit somewhere that isn't your desk. The candle does the heavy lifting: it tells your nervous system the day has changed shape.\n\nWe've designed ours to make that hour feel inevitable. Pour a glass of something, and let the rest of the day catch up to you.",
    coverImage:
      "https://images.pexels.com/photos/5933780/pexels-photo-5933780.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    category: "Ritual",
    author: "Maya Rodriguez",
    readMinutes: 3,
    publishedAt: new Date("2025-10-03"),
  },
  {
    slug: "how-to-burn",
    title: "The first-burn rule (and other ways to make a candle last longer)",
    excerpt:
      "A $34 candle shouldn't burn out in 20 hours. Here's how to get every last glow out of yours.",
    body:
      "The single biggest mistake people make with a new candle is putting it out too early on the first burn. The wax needs to melt all the way to the edge of the vessel the first time you light it—or it will tunnel down the middle forever.\n\nThe rest is easy. Trim the wick to a quarter inch before every light. Burn for no more than four hours at a time. Keep the candle away from drafts. Don't blow it out—use a wick dipper or a snuffer.\n\nFollow these and a clean soy candle will easily hit its promised 60-hour lifespan. Most of ours make it past 70.",
    coverImage:
      "https://images.pexels.com/photos/8471629/pexels-photo-8471629.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    category: "Care",
    author: "Aura & Earth",
    readMinutes: 5,
    publishedAt: new Date("2025-11-18"),
  },
  {
    slug: "scent-stories-fig",
    title: "Behind the scent: Wild Fig Orchard",
    excerpt:
      "A late-summer walk through a sun-warmed orchard in Northern California—and how it became our most surprising candle.",
    body:
      "Wild Fig Orchard started as a vacation notebook entry. The team was driving through Sonoma when the windows came down and the entire car went quiet. The combination of ripe black fig, a tart edge of cassis, and the crushed mint growing wild underfoot was, somehow, completely new to us.\n\nWe spent six months getting it right. Too much cassis and the candle reads as fruit-punch. Too much mint and it becomes toothpaste. The fig, we learned, is the anchor—it has to be unmistakable but not sweet.\n\nThe candle you'll burn today is version 47. It smells like that drive, if the drive was the best part of your summer.",
    coverImage:
      "https://images.pexels.com/photos/26997713/pexels-photo-26997713.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    category: "Scent",
    author: "Maya Rodriguez",
    readMinutes: 6,
    publishedAt: new Date("2026-01-22"),
  },
];
