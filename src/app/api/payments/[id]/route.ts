import { NextResponse } from "next/server";

import { getCheckoutPaymentDetails } from "@/lib/checkout/payment-details";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!/^(pay|sid)_[\w]{26,27}$/.test(id)) {
    return NextResponse.json(
      {
        error: "invalid_payment_identifier",
        message: "Expected a Checkout.com payment ID (`pay_...`) or session ID (`sid_...`).",
      },
      { status: 400 },
    );
  }

  try {
    const payment = await getCheckoutPaymentDetails(id);

    return NextResponse.json(payment, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to fetch Checkout.com payment details.";

    return NextResponse.json(
      {
        error: "payment_lookup_failed",
        message,
      },
      { status: 500 },
    );
  }
}
