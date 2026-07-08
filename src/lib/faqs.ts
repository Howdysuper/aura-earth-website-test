export type Faq = {
  q: string;
  a: string;
  category: "Products" | "Orders" | "Subscriptions" | "Shipping" | "Sustainability";
};

export const faqCategories = [
  "Products",
  "Subscriptions",
  "Orders",
  "Shipping",
  "Sustainability",
] as const;

export const faqs: Faq[] = [
  // Products
  {
    category: "Products",
    q: "What makes your candles non-toxic?",
    a: "We use only natural soy and coconut wax, lead-free cotton wicks, and clean fragrance oils that are free from phthalates, parabens, and synthetic dyes. Every batch is third-party tested so you know exactly what you're breathing.",
  },
  {
    category: "Products",
    q: "How long do the candles burn?",
    a: "Our signature candles burn for 60+ hours. For the longest, cleanest burn, trim your wick to ¼ inch before each light and let the first burn reach a full melt pool all the way to the edge.",
  },
  {
    category: "Products",
    q: "Are the vessels really reusable?",
    a: "Yes! Our stoneware vessels are designed to live on long after the candle does—use them as planters, catch-alls, or cups. Join our take-back program to return jars for a refill credit.",
  },
  {
    category: "Products",
    q: "Why soy and coconut wax instead of paraffin?",
    a: "Paraffin is a petroleum byproduct that can release volatile organic compounds when burned. Our soy and coconut blend burns cooler, cleaner, and slower—giving you better fragrance throw and cleaner air.",
  },
  {
    category: "Products",
    q: "Are your fragrances safe around pets?",
    a: "Our fragrances are phthalate-free and generally pet-safe when used in well-ventilated spaces. If you have birds or sensitive pets, we recommend keeping candles in a separate room and consulting your vet.",
  },
  // Subscriptions
  {
    category: "Subscriptions",
    q: "How does the monthly candle box work?",
    a: "Pick a plan and we'll deliver a fresh, exclusive seasonal scent to your door each month. You can skip a month, swap scents, pause, or cancel anytime from your account—no fees, no hassle.",
  },
  {
    category: "Subscriptions",
    q: "Can I skip a month or cancel?",
    a: "Anytime. Log in to your account and hit skip, pause, or cancel in a single click. There are no cancellation fees and no minimum commitment—ever.",
  },
  {
    category: "Subscriptions",
    q: "Can I gift a subscription?",
    a: "Absolutely. The Ritual annual plan makes a beautiful, low-effort gift. Choose a 3, 6, or 12-month duration and we'll send a digital gift card the recipient can redeem.",
  },
  {
    category: "Subscriptions",
    q: "Do subscribers get perks?",
    a: "Subscribers save 15–30% versus retail, get first access to limited drops, and receive occasional surprise gifts and add-ons in the box.",
  },
  // Orders
  {
    category: "Orders",
    q: "How do I track my order?",
    a: "The moment your order ships you'll get an email with a tracking link. You can also see every order and its status anytime in your account under Orders.",
  },
  {
    category: "Orders",
    q: "Can I change or cancel my order after placing it?",
    a: "We pack orders fast! If you contact us within 2 hours of ordering, we can usually edit or cancel it. After that it's already on its way, but our returns are easy.",
  },
  {
    category: "Orders",
    q: "How do returns and refunds work?",
    a: "Not in love? Return any unused item within 30 days for a full refund. Sale items are final. Just reach out and we'll send a prepaid return label.",
  },
  {
    category: "Orders",
    q: "Do I need an account to order?",
    a: "No—guest checkout is always available. Creating an account just makes future checkouts faster and lets you track orders and save favorites.",
  },
  // Shipping
  {
    category: "Shipping",
    q: "What's your shipping and returns policy?",
    a: "We offer free carbon-neutral shipping on orders over $50 and ship within 2 business days. Not in love? Return any unused item within 30 days for a full refund.",
  },
  {
    category: "Shipping",
    q: "Do you ship internationally?",
    a: "We currently ship across the US and Canada, with more regions coming soon. International rates are calculated at checkout based on destination.",
  },
  {
    category: "Shipping",
    q: "How fast will my order arrive?",
    a: "Orders ship within 2 business days and typically arrive in 3–5 business days via our carbon-neutral carrier partners.",
  },
  {
    category: "Shipping",
    q: "Is shipping really carbon-neutral?",
    a: "Yes—100% of delivery emissions are offset through verified climate projects, and our packaging is plastic-free and recyclable.",
  },
  // Sustainability
  {
    category: "Sustainability",
    q: "Do you really plant a tree with every order?",
    a: "Absolutely. We partner with reforestation nonprofits to plant a tree for every order placed—over 48,000 trees and counting—and we offset 100% of our shipping emissions.",
  },
  {
    category: "Sustainability",
    q: "How does the take-back program work?",
    a: "Send back any Aura & Earth vessel and we'll refill it for half the price of a new candle, or repair and donate it. Either way, every jar gets a second life.",
  },
  {
    category: "Sustainability",
    q: "Is your packaging recyclable?",
    a: "Yes. We use FSC-certified paper, soy-based inks, and zero plastic in the box. Everything you receive can go straight in your recycling bin.",
  },
];
