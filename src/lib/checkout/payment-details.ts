import { getCheckoutServerEnv } from "@/lib/checkout/env";

type CheckoutLookupError = {
  request_id?: string;
  error_type?: string;
  error_codes?: string[];
};

export async function getCheckoutPaymentDetails(id: string) {
  const { apiPrefix, secretKey } = getCheckoutServerEnv();
  const endpoint = `https://${apiPrefix}.api.sandbox.checkout.com/payments/${encodeURIComponent(id)}`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const rawBody = await response.text();
  const parsedBody = rawBody ? tryParseJson(rawBody) : null;

  if (!response.ok) {
    const apiError = parsedBody as CheckoutLookupError | null;
    const summary = apiError?.error_codes?.join(", ") ?? response.statusText;
    const requestId = apiError?.request_id ? ` Request ID: ${apiError.request_id}.` : "";

    throw new Error(
      `Checkout.com payment lookup failed with ${response.status}.${requestId} ${summary}`.trim(),
    );
  }

  if (!parsedBody || typeof parsedBody !== "object") {
    throw new Error("Checkout.com returned an empty or invalid payment details response.");
  }

  return parsedBody as Record<string, unknown>;
}

function tryParseJson(value: string) {
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}
