type ServerEnvKey =
  | "CKO_SECRET_KEY"
  | "CKO_API_PREFIX"
  | "CKO_DISPLAY_NAME"
  | "CKO_SUCCESS_URL"
  | "CKO_FAILURE_URL"
  | "CKO_PROCESSING_CHANNEL_ID";

function readRequiredEnv(key: ServerEnvKey) {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

export function getCheckoutServerEnv() {
  return {
    // Replace these sandbox values in `.env.local` with your own Checkout.com account credentials and URLs.
    secretKey: readRequiredEnv("CKO_SECRET_KEY"),
    apiPrefix: readRequiredEnv("CKO_API_PREFIX"),
    displayName: readRequiredEnv("CKO_DISPLAY_NAME"),
    successUrl: readRequiredEnv("CKO_SUCCESS_URL"),
    failureUrl: readRequiredEnv("CKO_FAILURE_URL"),
    processingChannelId: process.env.CKO_PROCESSING_CHANNEL_ID ?? "",
    webhookSecret: process.env.CKO_WEBHOOK_SECRET ?? "",
  };
}

export function getCheckoutPublicConfig() {
  const publicKey = process.env.CKO_PUBLIC_KEY;

  if (!publicKey) {
    throw new Error("Missing required environment variable: CKO_PUBLIC_KEY");
  }

  return {
    // Replace this sandbox public key in `.env.local` with your own Checkout.com publishable key.
    publicKey,
  };
}
