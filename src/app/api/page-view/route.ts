import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  let payload: unknown = null;
  try { payload = await request.json(); } catch { payload = { malformed: true }; }
  console.info("novel_redirect_page_view", JSON.stringify({ payload, ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null, userAgent: request.headers.get("user-agent") }));
  return NextResponse.json({ ok: true });
}
