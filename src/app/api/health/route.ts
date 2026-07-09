export const dynamic = "force-dynamic";

/**
 * Internal health check — returns a minimal status.
 * Does not expose backend details, SDK config, or connection info.
 */
export async function GET() {
  return Response.json({ status: "ok" });
}
