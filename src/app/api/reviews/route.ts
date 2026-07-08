import { getCurrentUser } from "@/lib/auth";
import { createReview, userHasPurchased } from "@/lib/firestore";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json(
      { ok: false, error: "Please sign in to leave a review." },
      { status: 401 },
    );
  }

  const ip = getClientIp(request);
  const { allowed } = checkRateLimit(`reviews:${user.id}:${ip}`);
  if (!allowed) {
    return Response.json(
      { ok: false, error: "Too many attempts. Please try again later." },
      { status: 429 }
    );
  }

  let body: { productId?: string; rating?: number; title?: string; body?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const productId = typeof body.productId === "string" ? body.productId.trim() : "";
  const rating = Math.max(1, Math.min(5, Math.floor(Number(body.rating))));
  const title = (body.title ?? "").trim().slice(0, 120);
  const text = (body.body ?? "").trim().slice(0, 2000);

  if (!productId || productId.length > 100) {
    return Response.json({ ok: false, error: "Invalid product." }, { status: 422 });
  }
  if (!Number.isFinite(rating)) {
    return Response.json({ ok: false, error: "Please choose a rating." }, { status: 422 });
  }
  if (!title || !text) {
    return Response.json(
      { ok: false, error: "Please add a title and a review." },
      { status: 422 },
    );
  }

  const verified = await userHasPurchased(user.id, productId);

  try {
    const review = await createReview({
      userId: user.id,
      productId,
      rating,
      title,
      body: text,
      verifiedPurchase: verified,
    });
    return Response.json({ ok: true, review });
  } catch {
    return Response.json(
      { ok: false, error: "Could not save your review. Please try again." },
      { status: 500 },
    );
  }
}
