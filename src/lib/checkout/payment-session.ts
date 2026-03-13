import type {
  CheckoutApiError,
  CreatePaymentSessionPayload,
  PaymentSessionResponse,
} from "@/lib/checkout/types";
import { getCheckoutServerEnv } from "@/lib/checkout/env";

export class PaymentSessionPayloadError extends Error {}

function validatePayload(payload: unknown): asserts payload is CreatePaymentSessionPayload {
  const candidate = payload as Partial<CreatePaymentSessionPayload> | null;

  const errors: string[] = [];

  if (!candidate || typeof candidate !== "object") {
    throw new PaymentSessionPayloadError("Request body must be a JSON object.");
  }

  if (typeof candidate.amount !== "number" || !Number.isInteger(candidate.amount) || candidate.amount < 0) {
    errors.push("`amount` must be a non-negative integer in minor currency units.");
  }

  if (!candidate.currency || typeof candidate.currency !== "string") {
    errors.push("`currency` is required.");
  }

  if (!candidate.reference || typeof candidate.reference !== "string") {
    errors.push("`reference` is required.");
  }

  if (!candidate.display_name || typeof candidate.display_name !== "string") {
    errors.push("`display_name` is required.");
  }

  if (!candidate.billing?.address?.country || typeof candidate.billing.address.country !== "string") {
    errors.push("`billing.address.country` is required.");
  }

  if (!candidate.customer?.name || typeof candidate.customer.name !== "string") {
    errors.push("`customer.name` is required.");
  }

  if (!candidate.customer?.email || typeof candidate.customer.email !== "string") {
    errors.push("`customer.email` is required.");
  }

  if (!candidate.success_url || typeof candidate.success_url !== "string") {
    errors.push("`success_url` is required.");
  }

  if (!candidate.failure_url || typeof candidate.failure_url !== "string") {
    errors.push("`failure_url` is required.");
  }

  if (errors.length > 0) {
    throw new PaymentSessionPayloadError(errors.join(" "));
  }
}

export function assertCreatePaymentSessionPayload(
  payload: unknown,
): asserts payload is CreatePaymentSessionPayload {
  validatePayload(payload);
}

export async function createCheckoutPaymentSession(
  payload: CreatePaymentSessionPayload,
): Promise<PaymentSessionResponse> {
  validatePayload(payload);

  const { apiPrefix, secretKey } = getCheckoutServerEnv();
  const endpoint = `https://${apiPrefix}.api.sandbox.checkout.com/payment-sessions`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const rawBody = await response.text();
  const parsedBody = rawBody ? tryParseJson(rawBody) : null;

  if (!response.ok) {
    const apiError = parsedBody as CheckoutApiError | null;
    const summary = apiError?.error_codes?.join(", ") ?? response.statusText;
    const requestId = apiError?.request_id ? ` Request ID: ${apiError.request_id}.` : "";
    const processingChannelHint = apiError?.error_codes?.includes("processing_channel_id_required")
      ? " Set CKO_PROCESSING_CHANNEL_ID in .env.local with a valid sandbox processing channel ID for your Checkout.com account."
      : "";

    throw new Error(
      `Checkout.com payment session request failed with ${response.status}.${requestId} ${summary}.${processingChannelHint}`.trim(),
    );
  }

  if (!parsedBody || typeof parsedBody !== "object") {
    throw new Error("Checkout.com returned an empty or invalid payment session response.");
  }

  return parsedBody as PaymentSessionResponse;
}

function tryParseJson(value: string) {
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}
