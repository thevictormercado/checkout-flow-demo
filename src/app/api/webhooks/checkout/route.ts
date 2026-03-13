import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("cko-signature");
  const contentType = request.headers.get("content-type");

  let parsedBody: unknown = rawBody;

  try {
    parsedBody = rawBody ? (JSON.parse(rawBody) as unknown) : {};
  } catch {
    parsedBody = rawBody;
  }

  console.log("[checkout-webhook] Incoming webhook payload", {
    signature,
    contentType,
    payload: parsedBody,
  });

  // Replace this logger-only handler with signature verification that uses CKO_WEBHOOK_SECRET before production use.
  return NextResponse.json({
    received: true,
  });
}
