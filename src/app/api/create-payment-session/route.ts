import { NextResponse } from "next/server";

import {
  PaymentSessionPayloadError,
  assertCreatePaymentSessionPayload,
  createCheckoutPaymentSession,
} from "@/lib/checkout/payment-session";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    assertCreatePaymentSessionPayload(payload);

    const paymentSession = await createCheckoutPaymentSession(payload);

    // Flow requires the unmodified payment session response body from Checkout.com.
    return NextResponse.json(paymentSession, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create Checkout.com payment session.";
    const status = error instanceof PaymentSessionPayloadError ? 400 : 500;

    return NextResponse.json(
      {
        error: "payment_session_creation_failed",
        message,
      },
      { status },
    );
  }
}
