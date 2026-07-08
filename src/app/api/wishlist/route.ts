import { getCurrentUser } from "@/lib/auth";
import { getWishlistItems, toggleWishlist } from "@/lib/firestore";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ ok: true, items: [] });
  }
  try {
    const items = await getWishlistItems(user.id);
    return Response.json({ ok: true, items });
  } catch {
    return Response.json({ ok: true, items: [] });
  }
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json(
      { ok: false, error: "Please sign in to use your wishlist." },
      { status: 401 },
    );
  }

  const ip = getClientIp(request);
  const { allowed } = checkRateLimit(`wishlist:${user.id}:${ip}`);
  if (!allowed) {
    return Response.json(
      { ok: false, error: "Too many attempts. Please try again later." },
      { status: 429 }
    );
  }

  let body: { productId?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  const productId = typeof body.productId === "string" ? body.productId.trim() : "";
  if (!productId || productId.length > 100) {
    return Response.json({ ok: false, error: "Invalid product." }, { status: 422 });
  }
  try {
    await toggleWishlist(user.id, productId);
    return Response.json({ ok: true, action: "added" });
  } catch {
    return Response.json(
      { ok: false, error: "Could not update wishlist." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ ok: false, error: "Not signed in." }, { status: 401 });
  }

  const ip = getClientIp(request);
  const { allowed } = checkRateLimit(`wishlist:${user.id}:${ip}`);
  if (!allowed) {
    return Response.json(
      { ok: false, error: "Too many attempts. Please try again later." },
      { status: 429 }
    );
  }

  let body: { productId?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  const productId = typeof body.productId === "string" ? body.productId.trim() : "";
  if (!productId || productId.length > 100) {
    return Response.json({ ok: false, error: "Invalid product." }, { status: 422 });
  }
  try {
    await toggleWishlist(user.id, productId);
    return Response.json({ ok: true, action: "removed" });
  } catch {
    return Response.json(
      { ok: false, error: "Could not update wishlist." },
      { status: 500 },
    );
  }
}
