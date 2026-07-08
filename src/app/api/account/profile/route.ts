import { getCurrentUser } from "@/lib/auth";
import {
  updateUserFullName,
  createAddress,
  deleteAddress,
  unsetDefaultAddresses,
} from "@/lib/firestore";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ ok: false, error: "Not signed in." }, { status: 401 });
  }

  const ip = getClientIp(request);
  const { allowed } = checkRateLimit(`profile:${user.id}:${ip}`);
  if (!allowed) {
    return Response.json(
      { ok: false, error: "Too many attempts. Please try again later." },
      { status: 429 }
    );
  }

  let body: { fullName?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const fullName = (body.fullName ?? "").trim().slice(0, 160);
  if (!fullName) {
    return Response.json({ ok: false, error: "Name is required." }, { status: 422 });
  }
  try {
    await updateUserFullName(user.id, fullName);
    return Response.json({ ok: true, user: { ...user, fullName } });
  } catch {
    return Response.json(
      { ok: false, error: "Could not update profile." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ ok: false, error: "Not signed in." }, { status: 401 });
  }

  const ip = getClientIp(request);
  const { allowed } = checkRateLimit(`address:${user.id}:${ip}`);
  if (!allowed) {
    return Response.json(
      { ok: false, error: "Too many attempts. Please try again later." },
      { status: 429 }
    );
  }

  let body: {
    label?: string;
    fullName?: string;
    address?: string;
    city?: string;
    postalCode?: string;
    country?: string;
    isDefault?: boolean;
  };
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const clean = {
    label: (body.label ?? "Home").trim().slice(0, 60) || "Home",
    fullName: (body.fullName ?? "").trim().slice(0, 160),
    address: (body.address ?? "").trim().slice(0, 500),
    city: (body.city ?? "").trim().slice(0, 120),
    postalCode: (body.postalCode ?? "").trim().slice(0, 24),
    country: (body.country ?? "").trim().slice(0, 120),
  };

  if (!clean.fullName || !clean.address || !clean.city || !clean.postalCode || !clean.country) {
    return Response.json(
      { ok: false, error: "Please complete every field." },
      { status: 422 },
    );
  }

  try {
    if (body.isDefault) {
      await unsetDefaultAddresses(user.id);
    }
    const row = await createAddress({
      userId: user.id,
      ...clean,
      isDefault: !!body.isDefault,
    });
    return Response.json({ ok: true, address: row });
  } catch {
    return Response.json(
      { ok: false, error: "Could not save address." },
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
  const { allowed } = checkRateLimit(`address:${user.id}:${ip}`);
  if (!allowed) {
    return Response.json(
      { ok: false, error: "Too many attempts. Please try again later." },
      { status: 429 }
    );
  }

  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id || id.length > 100) {
    return Response.json({ ok: false, error: "Invalid id." }, { status: 422 });
  }
  try {
    await deleteAddress(user.id, id);
    return Response.json({ ok: true });
  } catch {
    return Response.json(
      { ok: false, error: "Could not delete address." },
      { status: 500 },
    );
  }
}
