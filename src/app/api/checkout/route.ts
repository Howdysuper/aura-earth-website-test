import { getCurrentUser } from "@/lib/auth";
import {
  getProducts,
  createOrder,
  type Product,
} from "@/lib/firestore";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FREE_SHIPPING_THRESHOLD = 5000;
const SHIPPING_CENTS = 700;

type IncomingItem = { productId: string; quantity: number };

function makeReference(): string {
  const code = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `AE-${code}`;
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { allowed } = checkRateLimit(`checkout:${ip}`);

  if (!allowed) {
    return Response.json(
      { ok: false, error: "Too many attempts. Please try again later." },
      { status: 429 }
    );
  }
  let body: {
    email?: string;
    fullName?: string;
    address?: string;
    city?: string;
    postalCode?: string;
    country?: string;
    items?: IncomingItem[];
  };

  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const fullName = (body.fullName ?? "").trim().slice(0, 200);
  const address = (body.address ?? "").trim().slice(0, 300);
  const city = (body.city ?? "").trim().slice(0, 100);
  const postalCode = (body.postalCode ?? "").trim().slice(0, 20);
  const country = (body.country ?? "").trim().slice(0, 100);
  const items = Array.isArray(body.items) ? body.items : [];
  const user = await getCurrentUser();

  if (!EMAIL_RE.test(email)) {
    return Response.json(
      { ok: false, error: "Please enter a valid email address." },
      { status: 422 },
    );
  }
  if (!fullName || !address || !city || !postalCode || !country) {
    return Response.json(
      { ok: false, error: "Please complete all shipping fields." },
      { status: 422 },
    );
  }
  if (items.length === 0) {
    return Response.json(
      { ok: false, error: "Your cart is empty." },
      { status: 422 },
    );
  }

  // Aggregate quantities
  const wantedQty = new Map<string, number>();
  for (const item of items) {
    const id = String(item.productId).trim();
    const qty = Math.max(1, Math.min(99, Math.floor(Number(item.quantity) || 0)));
    if (!id || qty <= 0) continue;
    wantedQty.set(id, (wantedQty.get(id) ?? 0) + qty);
  }
  const ids = [...wantedQty.keys()];
  if (ids.length === 0 || ids.length > 50) {
    return Response.json(
      { ok: false, error: "No valid items in cart." },
      { status: 422 },
    );
  }

  try {
    // Fetch products from Firestore
    const allProducts = await getProducts();
    const productMap = new Map(allProducts.map((p) => [p.id, p]));

    let subtotal = 0;
    const lineItems: {
      productId: string;
      productName: string;
      unitPriceCents: number;
      quantity: number;
    }[] = [];
    const stockUpdates: { productId: string; newStock: number }[] = [];

    for (const [id, qty] of wantedQty) {
      const product = productMap.get(id);
      if (!product) {
        throw new Error("A product in your cart is no longer available.");
      }
      if (product.stock < qty) {
        throw new Error(
          `Only ${product.stock} of "${product.name}" left in stock.`,
        );
      }
      subtotal += product.priceCents * qty;
      lineItems.push({
        productId: product.id,
        productName: product.name,
        unitPriceCents: product.priceCents,
        quantity: qty,
      });
      stockUpdates.push({
        productId: product.id,
        newStock: product.stock - qty,
      });
    }

    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_CENTS;
    const total = subtotal + shipping;
    const reference = makeReference();

    const result = await createOrder({
      reference,
      userId: user?.id ?? null,
      email,
      fullName,
      address,
      city,
      postalCode,
      country,
      subtotalCents: subtotal,
      shippingCents: shipping,
      totalCents: total,
      items: lineItems,
      stockUpdates,
    });

    return Response.json({ ok: true, ...result });
  } catch (err) {
    const message =
      err instanceof Error && err.message
        ? err.message
        : "Checkout failed. Please try again.";
    return Response.json({ ok: false, error: message }, { status: 409 });
  }
}
