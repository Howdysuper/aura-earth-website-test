import { updateProduct } from "@/lib/firestore";
import { getCurrentUser } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  if (ADMIN_EMAILS.length > 0 && !ADMIN_EMAILS.includes(user.email?.toLowerCase() ?? "")) {
    return Response.json({ ok: false, error: "Forbidden." }, { status: 403 });
  }

  const ip = getClientIp(request);
  const { allowed } = checkRateLimit(`admin:${user.id}:${ip}`);
  if (!allowed) {
    return Response.json(
      { ok: false, error: "Too many attempts. Please try again later." },
      { status: 429 }
    );
  }

  let body: { id?: string; stock?: number; priceCents?: number };
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const id = typeof body.id === "string" ? body.id.trim() : "";
  if (!id || id.length > 100) {
    return Response.json({ ok: false, error: "Invalid product id." }, { status: 422 });
  }

  const updates: { stock?: number; priceCents?: number } = {};
  if (body.stock !== undefined) {
    const stock = Math.max(0, Math.floor(Number(body.stock)));
    if (!Number.isFinite(stock)) {
      return Response.json({ ok: false, error: "Invalid stock." }, { status: 422 });
    }
    updates.stock = stock;
  }
  if (body.priceCents !== undefined) {
    const price = Math.max(0, Math.floor(Number(body.priceCents)));
    if (!Number.isFinite(price)) {
      return Response.json({ ok: false, error: "Invalid price." }, { status: 422 });
    }
    updates.priceCents = price;
  }

  if (Object.keys(updates).length === 0) {
    return Response.json({ ok: false, error: "Nothing to update." }, { status: 422 });
  }

  try {
    const updated = await updateProduct(id, updates);
    if (!updated) {
      return Response.json({ ok: false, error: "Product not found." }, { status: 404 });
    }
    return Response.json({ ok: true, product: updated });
  } catch {
    return Response.json(
      { ok: false, error: "Update failed. Please try again." },
      { status: 500 },
    );
  }
}
