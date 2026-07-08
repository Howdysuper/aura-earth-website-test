import { checkFirestoreConnection } from "@/lib/firestore";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const ok = await checkFirestoreConnection();
    return Response.json({ ok });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
